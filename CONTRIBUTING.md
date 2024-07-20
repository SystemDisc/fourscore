To ensure comprehensive coverage of commit message types, including those related to changing local configuration files and any other types used by mainstream contributing guidelines, here’s an updated list of commit types. These types align with conventions from popular projects and guidelines.

## <a name="commit"></a> Commit Message Format

We have very precise rules over how our Git commit messages must be formatted.  
This format leads to **easier to read commit history**.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the [Commit Message Header](#commit-header) format.

The `body` is mandatory for all commits except for those of type "docs".  
When the body is present it must be at least 20 characters long and must conform to the [Commit Message Body](#commit-body) format.

The `footer` is optional. The [Commit Message Footer](#commit-footer) format describes what the footer is used for and the structure it must have.

#### <a name="commit-header"></a>Commit Message Header

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: animations|bazel|benchpress|common|compiler|compiler-cli|core|
  │                          elements|forms|http|language-service|localize|platform-browser|
  │                          platform-browser-dynamic|platform-server|router|service-worker|
  │                          upgrade|zone.js|packaging|changelog|docs-infra|migrations|
  │                          devtools|config|local|settings
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test|chore|style|config
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

##### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Routine tasks such as updating dependencies, formatting code, etc.
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **config**: Changes to configuration files, settings, or other local configuration (example scopes: `.gitignore`, `.editorconfig`, local settings)

#### <a name="commit-body"></a> Commit Message Body

The body should include the motivation for the change and contrast this with previous behavior.

#### <a name="commit-footer"></a> Commit Message Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit closes.

```
BREAKING CHANGE: <description of what is breaking and how to migrate>
```

For a detailed guide on how to write commit messages, refer to the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

### Sources:

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [AngularJS Commit Message Format](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [Karma Commit Message Format](https://karma-runner.github.io/6.3/dev/git-commit-msg.html)
