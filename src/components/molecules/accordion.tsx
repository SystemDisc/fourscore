'use client';

import classNames from 'classnames';
import {
  CSSProperties,
  ComponentType,
  ReactNode,
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { BsChevronDown } from 'react-icons/bs';
import Button from '../atoms/button';

export default forwardRef(function Accordion(
  {
    header,
    isOpen,
    onToggle,
    children,
    iconRotation,
    icon,
    isRounded,
    tabHeadings,
    tabs,
    className,
    wrapperClassname,
    headerClassname,
    ...props
  }: {
    header: string | ReactNode;
    isOpen?: boolean;
    onToggle?: (isOpen: boolean) => void;
    children?: ReactNode;
    iconRotation?: number;
    icon?: ComponentType<{ className: string; style?: CSSProperties }>;
    isRounded?: boolean;
    tabHeadings?: string[];
    tabs?: ReactNode[];
    wrapperClassname?: string;
    headerClassname?: string;
  } & React.HTMLAttributes<HTMLDivElement>,
  ref?: Ref<{ updateSize: () => void }>,
) {
  if (iconRotation === undefined) {
    iconRotation = 180;
  }
  const [open, setOpen] = useState(isOpen || false);
  const headerRef = useRef<HTMLElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const Icon: ComponentType<{ className: string; style?: CSSProperties }> =
    icon || BsChevronDown;
  const rounded = isRounded === undefined ? true : isRounded;

  useEffect(() => {
    const handler = () => {
      if (articleRef.current && open) {
        const height = [...articleRef.current.children].reduce(
          (height, elem) => {
            return height + elem.clientHeight;
          },
          0,
        );
        articleRef.current.style.height = `${height}px`;
      }
    };
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, [open]);

  const toggle = () => {
    if (onToggle) {
      onToggle(!open);
    }
    setOpen(!open);
    if (articleRef.current) {
      if (!open) {
        articleRef.current.style.height = '0px';
        const start = new Date().getTime();
        setTimeout(() => {
          if (articleRef.current) {
            articleRef.current.style.height = `${articleRef.current.scrollHeight}px`;

            let stop = false;
            const animate = () => {
              setTimeout(() => {
                const y = headerRef.current?.getClientRects()[0].y || 0;
                const viewportHeight = window.innerHeight;
                if (y < 0 || y > viewportHeight) {
                  headerRef.current?.scrollIntoView(true);
                }
                const end = new Date().getTime();
                if (!stop) {
                  animate();
                }
                if (end - start > 200) {
                  stop = true;
                }
              }, 1);
            };
            animate();
          }
        });
      } else {
        articleRef.current.style.height = `${articleRef.current.scrollHeight}px`;
        setTimeout(() => {
          if (articleRef.current) {
            articleRef.current.style.height = '0px';
          }
        });
      }
    }
  };

  useEffect(() => {
    if ((isOpen === true || isOpen === false) && isOpen != open) {
      toggle();
    }
  }, [isOpen]);

  useImperativeHandle(ref, () => ({
    updateSize: () => {
      if (open) {
        setTimeout(() => {
          if (articleRef.current && open) {
            articleRef.current.style.height = `${articleRef.current.scrollHeight}px`;
          }
        });
      }
    },
  }));

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className={wrapperClassname} {...props}>
      <header
        ref={headerRef}
        className={classNames(
          'min-h-16 flex items-center justify-center border border-b-0 border-white bg-neutral-300 p-4 cursor-pointer !text-black',
          {
            rounded: rounded,
            'rounded-b-none': open && rounded,
          },
          headerClassname,
        )}
        onClick={(e) => {
          const elems = document.querySelectorAll('.tab-button');
          if ([...elems].every((elem) => !elem.contains(e.target as Node))) {
            toggle();
          }
        }}
      >
        {typeof header === 'string' ? (
          <span className='flex-1'>{header}</span>
        ) : (
          header
        )}
        <div className='flex items-center'>
          {tabHeadings &&
            tabHeadings.map((heading, index) => (
              <Button
                key={heading}
                type='button'
                className={classNames(
                  'tab-button inline-block border border-sermons-dark rounded font-bold px-2 py-1 mr-2',
                  {
                    'bg-white !text-black active:brightness-125 hover:brightness-110':
                      selectedTab !== index,
                    'bg-gradient-to-b from-sermons-light to-sermons-dark !text-black active:from-sermons-dark active:to-sermons-dark hover:brightness-110':
                      selectedTab === index,
                  },
                )}
                onClick={() => setSelectedTab(index)}
              >
                {heading}
              </Button>
            ))}
          <Icon
            className='inline-block text-3xl transition-transform text-sermons-dark'
            style={{ transform: open ? `rotate(${iconRotation}deg)` : '' }}
          />
        </div>
      </header>
      <article
        className={classNames('transition-[height] bg-white text-black', {
          'h-0 overflow-hidden': !open,
        })}
        ref={articleRef}
      >
        <div
          className={classNames(
            'border border-t-0 border-white p-4',
            className,
          )}
        >
          {tabs &&
            tabs.map((tab, index) => (
              <article
                key={index}
                className={classNames({
                  hidden: selectedTab !== index,
                })}
              >
                {tab}
              </article>
            ))}
          {children}
        </div>
      </article>
    </div>
  );
});
