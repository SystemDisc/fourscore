import { NewAnswer } from '@/db/database';
import appRootPath from 'app-root-path';
import * as fs from 'fs';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import pRetry from 'p-retry';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface ExtendedAnswer extends NewAnswer {
  id: string;
  importance: number;
}

const jsonFilename = path.resolve(appRootPath.path, 'src', 'data', 'candidateResponses.json');

async function main() {
  let existingAnswers: ExtendedAnswer[] = [];
  try {
    const contents = fs.readFileSync(jsonFilename);
    existingAnswers = JSON.parse(contents.toString());
  } catch (error) {
    console.error('Error reading existing answers:', error);
  }

  const apiKey = process.env.OPENAI_API_KEY; // Use environment variable for API key
  if (!apiKey) {
    throw new Error('API key is missing. Please set the OPENAI_API_KEY environment variable.');
  }

  const client = new OpenAI({ apiKey });

  const now = new Date();
  const calcRating = (percent?: number) => (percent ? Math.round((percent / 100) * 5) : null);

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content:
        'How would Robert F. Kennedy Jr., as a 2024 presidential candidate, answer the following question in the context of local government policy, and what percentage of importance would they give the answer? Do you favor zoning changes to allow more affordable housing developments?\n\nBased on your response, I need JSON with an "agree" property set to either true or false and an "importance" property set to the average percentage of importance. You must choose whether or not the candidate would agree overall; they either do or do not - there is no alternative.',
    },
    {
      role: 'assistant',
      content:
        'As a 2024 presidential candidate, Robert F. Kennedy Jr. would likely approach the question of zoning changes to allow more affordable housing developments with a focus on community empowerment, environmental sustainability, and social equity.\n\n**Answer:** Robert F. Kennedy Jr. would probably advocate for zoning changes that enable more affordable housing developments, emphasizing the need to address the housing affordability crisis while ensuring that any new developments are environmentally sustainable and socially equitable. He might argue that local governments should have the flexibility to implement zoning reforms that reflect the unique needs and characteristics of their communities. Kennedy could stress the importance of involving local residents in the decision-making process to ensure that new housing developments benefit the community and do not lead to negative consequences such as gentrification or environmental degradation. He would likely support policies that promote smart growth, mixed-use developments, and the preservation of green spaces while increasing the availability of affordable housing.\n\n**Percentage of Importance:** Given his focus on social equity and environmental sustainability, Kennedy would likely assign a high importance to this issue, possibly in the range of 60-70%. This reflects his belief that zoning changes are a critical tool for addressing the housing affordability crisis and promoting more equitable and sustainable communities.\n\n```json\n{\n  "agree": true,\n  "importance": 65\n}\n```',
    },
  ];

  async function askChatGPT(content: string) {
    console.log('User:');
    console.log(content);
    console.log();

    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        ...messages,
        {
          role: 'user',
          content,
        },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const text = response.choices[0].message.content?.trim();

    console.log('ChatGPT:');
    console.log(text);
    console.log();

    if (!text) {
      throw response;
    }
    return text;
  }

  async function getResponse(question: string) {
    const text = await askChatGPT(question);

    const match = text.match(
      /^.*\*\*Answer:\*\*\s*(.*)\s*\*\*Percentage of Importance:\*\*\s*(.*)\s*(```(json)?)\s*(\{.*\})\s*```\s*$/is,
    );

    if (!match) {
      throw new Error(`Failed to parse response: ${text}`);
    }

    const answer = match[1].trim();
    const importance = match[2].trim();
    const json = match[5]?.trim();
    let jsonResponse: { agree: boolean; importance: number } | null = null;

    if (json) {
      try {
        jsonResponse = JSON.parse(json);
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        throw new Error(`Failed to parse JSON response: ${json}`);
      }
    }

    if (!jsonResponse) {
      throw new Error(`Failed to extract JSON response: ${text}`);
    }

    return { answer, importance, agree: jsonResponse.agree, rating: jsonResponse.importance };
  }

  async function generateCandidateResponses() {
    const candidateResponses = [...existingAnswers];

    for (const question of initialQuestions) {
      for (const candidate of initialPresidentialCandidates) {
        if (existingAnswers.find((a) => a.questionId === question.id && a.userId === candidate.id)) {
          continue;
        }
        const prompt = `How would ${
          candidate.name
        }, as a 2024 presidential candidate, answer the following question in the context of ${(
          initialLocalities.find((l) => l.id === question.localityId)?.name || 'federal'
        ).toLowerCase()} government policy, and what percentage of importance would they give the answer?\n\n${
          question.question
        }`;

        const response = await pRetry(() => getResponse(prompt), { forever: true });

        const answerObject: ExtendedAnswer = {
          id: uuidv4(),
          userId: candidate.id,
          questionId: question.id,
          agree: response.agree,
          rating: calcRating(response.rating),
          importance: response.rating,
          dateUpdated: now,
          notes: `**Answer:** ${response.answer}\n\n**Percentage of Importance:** ${response.importance}`,
          skipped: false,
          answeredByStaff: true,
        };

        candidateResponses.push(answerObject);

        fs.writeFileSync(jsonFilename, JSON.stringify(candidateResponses, null, 2));
      }
    }
  }

  await generateCandidateResponses();
}

const initialQuestions = [
  {
    id: 'f15804f2-738c-4b9f-8bb7-e6064fb73e17',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: 'ab47e6b6-985e-4a9f-b025-1e26ae06ac5f',
    question: 'Should the city invest in infrastructure improvements in underserved neighborhoods?',
  },
  {
    id: 'f0d91e14-c6d1-4873-8f84-2add4ac1f5ae',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: '1d997f44-2107-4f44-b5b4-0ea9ab3b4785',
    question:
      'Do you believe in increasing funding for public transportation to improve accessibility and reduce traffic congestion?',
  },
  {
    id: 'eba2966b-aa5f-4d3e-9e38-1dda14cb3eb4',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: 'ad14126f-93a8-49d8-8d7f-16c9d0f4110c',
    question: 'Do you support the increase of local funding for public schools?',
  },
  {
    id: 'e4adcd2f-a41a-4815-90b0-e9a4d178052f',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: 'ab47e6b6-985e-4a9f-b025-1e26ae06ac5f',
    question: 'Do you favor zoning changes to allow more affordable housing developments?',
  },
  {
    id: 'cdb4d376-d205-44ea-a7bf-47f21522ee50',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: 'ad14126f-93a8-49d8-8d7f-16c9d0f4110c',
    question: 'Should the city offer free community college tuition to residents?',
  },
  {
    id: 'cc74aca8-bece-46b7-bab6-7a4476f19684',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: '9c80af67-183f-4abe-90a1-dd9130d434af',
    question: 'Do you believe in increasing funding for local arts and cultural programs?',
  },
  {
    id: 'c0300c9d-a752-47db-bfe1-5a2af6cfc254',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: '24fbb8ac-3411-4a64-8dd4-9397770a0e8d',
    question: 'Do you believe the city should expand mental health services accessible to the public?',
  },
  {
    id: 'a0eecdee-4dc3-4703-99db-d87168e64425',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: '9c80af67-183f-4abe-90a1-dd9130d434af',
    question: 'Should the city sponsor annual community events to promote local businesses and tourism?',
  },
  {
    id: '86dea7a3-e54d-49ac-a680-2cb644d5f2f2',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: '24fbb8ac-3411-4a64-8dd4-9397770a0e8d',
    question: 'Should local government increase support for homeless shelters and services?',
  },
  {
    id: '82cf5c24-0351-4d35-a36a-759bd4db0443',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: 'cef96fab-1514-44cc-bc50-0c99dd45559b',
    question: 'Do you support the implementation of stricter gun control measures within city limits?',
  },
  {
    id: '8192ffe5-b35b-4f44-97ce-d754de35e4ef',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: 'fa72ab83-776a-46a2-902a-22e9c67731ef',
    question: 'Do you support the initiative to provide free public Wi-Fi in key areas of the city?',
  },
  {
    id: '5706bf8e-02a1-4e62-87ad-572092aed271',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: 'fa72ab83-776a-46a2-902a-22e9c67731ef',
    question:
      'Should the city invest in smart technology to improve public services (e.g., waste management, water supply)?',
  },
  {
    id: '560150b9-8703-4aaf-9615-4f2023b831d7',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: 'cb791c95-210b-48c8-ae67-b539d7e1a470',
    question: 'Should the city invest more in renewable energy sources for public buildings?',
  },
  {
    id: '29b31426-88ad-49aa-8642-341c9c0a46df',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: '1d997f44-2107-4f44-b5b4-0ea9ab3b4785',
    question: 'Should local government provide tax incentives to attract small businesses?',
  },
  {
    id: '29834eb8-1112-404f-acd1-1f4c5b979f87',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: 'cef96fab-1514-44cc-bc50-0c99dd45559b',
    question: 'Should the city increase funding for community policing initiatives?',
  },
  {
    id: '081b7aaf-3c0d-4e07-ac53-4f030b89e946',
    localityId: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    categoryId: 'cb791c95-210b-48c8-ae67-b539d7e1a470',
    question: 'Do you support the expansion of public parks and green spaces within the city?',
  },
  {
    id: 'e1e4a654-ef13-4e44-a476-02fb4c945275',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: '1d997f44-2107-4f44-b5b4-0ea9ab3b4785',
    question: 'Do you support raising the minimum wage to a livable standard within the state?',
  },
  {
    id: 'd377e781-321b-425a-9e75-2eb32f758202',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: '95ceb2e0-b225-4632-be11-c363a90236ec',
    question: 'Do you support state-level initiatives to reduce carbon emissions and combat climate change?',
  },
  {
    id: 'd1fe7e7a-1146-4064-a739-d0066fa7273e',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: '24fbb8ac-3411-4a64-8dd4-9397770a0e8d',
    question: 'Do you support the legalization of marijuana for recreational use?',
  },
  {
    id: 'c9a11f55-2731-4339-a55d-2645edd39097',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: '0e72f83a-c1a3-4161-8428-d8a9b30a657b',
    question: 'Do you support increased state investment in public transportation infrastructure?',
  },
  {
    id: 'c87a586c-c7ea-47e9-a71b-37cc2837dbe6',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: 'ad14126f-93a8-49d8-8d7f-16c9d0f4110c',
    question: 'Do you support state-funded scholarship programs for higher education?',
  },
  {
    id: 'c782ab35-8b52-4c68-85bd-7e430f8d3bc1',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: '86372c9f-3664-45d7-bcb4-623c018b9e04',
    question: 'Do you support state policies that encourage the creation of more union jobs?',
  },
  {
    id: 'c109e589-76a3-4669-9fee-b70ced0e4f85',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: '24fbb8ac-3411-4a64-8dd4-9397770a0e8d',
    question: 'Should the state protect the right to abortion access?',
  },
  {
    id: 'b90b3655-fdaf-45ec-ae7f-ed1c41fc8ee6',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: 'ad14126f-93a8-49d8-8d7f-16c9d0f4110c',
    question: 'Should the state increase funding for K-12 public education?',
  },
  {
    id: 'b670278f-0efb-4443-8ed2-7b39230eb383',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: 'd2772382-aa6a-4bc7-a30b-bf7420f0a565',
    question: 'Do you believe in increasing state taxes on the wealthy to fund public services?',
  },
  {
    id: 'b06c673e-73e0-4951-98bd-78b3732a067a',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: 'ee24c5b2-c3b7-40ee-8041-1e528e02e6fa',
    question:
      'Should the state expand Medicaid to provide more low-income individuals and families with health coverage?',
  },
  {
    id: 'a1f47abc-8668-4800-b0b2-d574a9a8cff2',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: '95ceb2e0-b225-4632-be11-c363a90236ec',
    question: 'Should the state allocate funds to protect and restore natural habitats and wildlife?',
  },
  {
    id: '9fc9bc7d-aa2f-4a42-862c-d9afa8bd2454',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: '1d997f44-2107-4f44-b5b4-0ea9ab3b4785',
    question: 'Should the state offer tax incentives to businesses that implement green technologies?',
  },
  {
    id: '8bbe2aaf-9b84-4b2d-a73e-39913d5b74bb',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: 'f3ea37aa-455d-48fb-87d6-f46809f8f802',
    question: 'Should the state enforce stricter gun control laws?',
  },
  {
    id: '8692105c-97ad-418f-afdd-64293134489e',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: '86372c9f-3664-45d7-bcb4-623c018b9e04',
    question: 'Should the state require paid family leave for all employees?',
  },
  {
    id: '820ecaef-3802-4ad8-a921-e79b8242c0fd',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: '0e72f83a-c1a3-4161-8428-d8a9b30a657b',
    question: 'Should the state allocate more resources to improving broadband internet access in rural areas?',
  },
  {
    id: '61c3b1db-ea51-4816-a7e1-7a6ecc90bb49',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: 'd2772382-aa6a-4bc7-a30b-bf7420f0a565',
    question: 'Should the state prioritize funding for renewable energy projects over fossil fuels?',
  },
  {
    id: '3aa95c1b-d8b1-4d6b-ab3e-9747993a9729',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: 'f3ea37aa-455d-48fb-87d6-f46809f8f802',
    question:
      "Do you believe in reforming the state's criminal justice system to focus more on rehabilitation than punishment?",
  },
  {
    id: '2e557e12-1931-44b2-9f68-55e8e0496901',
    localityId: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    categoryId: 'ee24c5b2-c3b7-40ee-8041-1e528e02e6fa',
    question: 'Do you believe in implementing state-level regulations to reduce prescription drug prices?',
  },
  {
    id: 'fff353c3-68d4-4038-8e64-2f5fb15cba28',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: '1d997f44-2107-4f44-b5b4-0ea9ab3b4785',
    question: 'Do you support the implementation of a nationwide minimum wage increase?',
  },
  {
    id: 'e6a7d80f-1b9d-4c99-9ee2-0c2c61f339c0',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: '95ceb2e0-b225-4632-be11-c363a90236ec',
    question: 'Should the federal government invest in renewable energy sources to reduce dependence on fossil fuels?',
  },
  {
    id: 'db86f386-6bd6-4e72-96b1-720747e81e10',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: 'a77d8328-8cf8-4f81-b635-dff8c779a423',
    question: 'Should the United States reduce its military presence overseas?',
  },
  {
    id: 'ac6711b6-491f-41d2-90fe-9bb2e24aa5d9',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: '65051268-3a16-470d-a661-f93cacf7de58',
    question: 'Should the federal government enact more comprehensive anti-discrimination laws?',
  },
  {
    id: 'a6799358-bf54-4c2b-a5c3-d549211ff0b7',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: '24fbb8ac-3411-4a64-8dd4-9397770a0e8d',
    question: 'Do you support nationwide legalization of same-sex marriage?',
  },
  {
    id: '97504394-41e2-46cc-acbc-b4bba9537775',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: '1d997f44-2107-4f44-b5b4-0ea9ab3b4785',
    question:
      'Should the federal government implement more stringent regulations on Wall Street and financial institutions?',
  },
  {
    id: '82c11445-4bf8-407c-955e-ef9ee3cd770c',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: 'd2772382-aa6a-4bc7-a30b-bf7420f0a565',
    question: 'Do you support reforming the tax code to ensure higher taxes on the wealthiest Americans?',
  },
  {
    id: '7feea740-ed63-40a7-8a4f-2fefb058f6d3',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: '86372c9f-3664-45d7-bcb4-623c018b9e04',
    question: 'Should the federal government mandate paid parental leave?',
  },
  {
    id: '7e6de2a1-c1d1-46f5-bc36-d7c4f232f6af',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: '9406a9f3-bdf0-4e26-846e-ec62a4136837',
    question: 'Should the federal government increase funding for border security?',
  },
  {
    id: '79771ad7-e20e-4a2f-a44a-196b503f2e42',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: 'a77d8328-8cf8-4f81-b635-dff8c779a423',
    question: 'Do you believe in increasing the defense budget to enhance national security?',
  },
  {
    id: '6f1c5a55-1fa6-40ef-a492-99e438cbb6c7',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: '9406a9f3-bdf0-4e26-846e-ec62a4136837',
    question: 'Do you support a path to citizenship for undocumented immigrants currently living in the United States?',
  },
  {
    id: '693e5023-4f78-44da-ab32-0253cd2f26c1',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: '86372c9f-3664-45d7-bcb4-623c018b9e04',
    question: "Do you support the expansion of federal programs to protect workers' rights and promote job creation?",
  },
  {
    id: '5696a094-3d0a-4f8f-b4bc-d2e4242e9cd8',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: '24fbb8ac-3411-4a64-8dd4-9397770a0e8d',
    question: 'Should the federal government enforce stricter gun control laws?',
  },
  {
    id: '4f363556-c98d-4fab-82a4-7d0c65a2ccad',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: 'd2772382-aa6a-4bc7-a30b-bf7420f0a565',
    question: 'Should the federal government provide more tax incentives for small businesses?',
  },
  {
    id: '36549ffe-6eb3-49e1-84eb-126bea845dc2',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: 'ad14126f-93a8-49d8-8d7f-16c9d0f4110c',
    question: 'Do you believe in making public college tuition-free for all Americans?',
  },
  {
    id: '2d6e7f96-b864-4300-b0d3-43b916ce45a9',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: 'ee24c5b2-c3b7-40ee-8041-1e528e02e6fa',
    question: 'Should the federal government take steps to lower the cost of prescription drugs?',
  },
  {
    id: '274b5d4d-9845-4ffc-a216-b87a9b11e1af',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: 'ad14126f-93a8-49d8-8d7f-16c9d0f4110c',
    question: 'Should the federal government forgive student loan debt?',
  },
  {
    id: '24aabccf-abd4-416e-9d18-956e1e4da95c',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: '65051268-3a16-470d-a661-f93cacf7de58',
    question: 'Do you believe the federal government should play a larger role in protecting voting rights?',
  },
  {
    id: '1c2f5f01-714e-477f-ac9c-154dc16db82b',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: '95ceb2e0-b225-4632-be11-c363a90236ec',
    question:
      'Do you support the United States rejoining international agreements focused on combating climate change?',
  },
  {
    id: '14030697-ffb0-48e0-b4e1-9004ba6b6d2e',
    localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    categoryId: 'ee24c5b2-c3b7-40ee-8041-1e528e02e6fa',
    question: 'Do you believe in a single-payer healthcare system as a solution for the United States?',
  },
];

const initialPresidentialCandidates = [
  {
    id: 'b047056f-6d63-4afc-8870-e616abaf7505',
    name: 'Chase Oliver',
    email: 'chaseoliver@fourscore.app',
    emailVerified: null,
    image: '/images/chase-oliver.jpg',
    dateUpdated: null,
    seenVotingTutorial: false,
  },
  {
    id: '267a857e-d76f-4223-884f-076c0c66e85e',
    name: 'Cornel West',
    email: 'cornelwest@fourscore.app',
    emailVerified: null,
    image: '/images/cornel-west.jpg',
    dateUpdated: null,
    seenVotingTutorial: true,
  },
  {
    id: '04a990af-a61e-41f2-beb0-d4098b533de5',
    name: 'Donald J. Trump',
    email: 'donaldjtrump@fourscore.app',
    emailVerified: null,
    image: '/images/donald-trump.jpg',
    dateUpdated: null,
    seenVotingTutorial: false,
  },
  {
    id: '69504b7c-4961-4b3f-867a-d2c6b5f4cdb3',
    name: 'Jill Stein',
    email: 'jillstein@fourscore.app',
    emailVerified: null,
    image: '/images/jill-stein.jpg',
    dateUpdated: null,
    seenVotingTutorial: false,
  },
  {
    id: 'c3066d9e-ac51-444d-a4bd-8dd690554610',
    name: 'Joe Biden',
    email: 'joebiden@fourscore.app',
    emailVerified: null,
    image: '/images/joe-biden.jpg',
    dateUpdated: null,
    seenVotingTutorial: false,
  },
  {
    id: '87ab6a98-2c2b-4429-8d22-89eda0506fbb',
    name: 'Robert F. Kennedy Jr.',
    email: 'robertfkennedyjr@fourscore.app',
    emailVerified: null,
    image: '/images/robert-f-kennedy-jr.jpg',
    dateUpdated: null,
    seenVotingTutorial: false,
  },
  {
    id: 'd411c88e-162b-4881-b1cd-ee9c6352459e',
    name: 'Kamala Harris',
    email: 'kamalaharris@fourscore.app',
    emailVerified: null,
    image: '/images/kamala-harris.jpg',
    dateUpdated: null,
    seenVotingTutorial: false,
  },
];

const initialLocalities = [
  {
    id: 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e',
    name: 'Local',
    position: 0,
  },
  {
    id: '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2',
    name: 'State',
    position: 1,
  },
  {
    id: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
    name: 'Federal',
    position: 2,
  },
];

main();
