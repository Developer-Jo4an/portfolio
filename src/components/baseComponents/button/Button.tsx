import React, {useState, MouseEvent, useEffect} from "react";
import classnames from "classnames";

interface ClassNamesProps {
  [key: string]: boolean;
}

interface ButtonProps {
  className?: string,
  classNames?: ClassNamesProps,
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void,
  disabled?: boolean,
  timeout?: number,
  disposable?: boolean,
  children?: React.ReactNode
}

const Button = (
  {
    className,
    classNames,
    onClick: onClickFunction,
    disabled,
    timeout,
    disposable,
    children
  }: ButtonProps
) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [timeoutButton, setTimeoutButton] = useState<ReturnType<typeof setTimeout> | null>(null);

  const classes: [string | any, string | any, ClassNamesProps | any] = ["button", className, classNames];

  const onClick = (e: MouseEvent<HTMLButtonElement>): void => {
    if (isDisabled) return;

    onClickFunction?.(e);

    if (disposable) {
      setIsDisabled(true);
      return;
    }

    if (timeout) {
      setIsDisabled(true);
      setTimeoutButton(
        setTimeout((): void => {
          setIsDisabled(false);
        }, timeout)
      );
    }
  };

  useEffect((): (() => void) => {
    return (): void => {
      if (timeoutButton)
        clearTimeout(timeoutButton);
    };
  }, [timeoutButton]);

  return (
    <button
      disabled={disabled || isDisabled}
      className={classnames(...classes)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
