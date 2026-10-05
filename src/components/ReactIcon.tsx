import type { IconType } from "react-icons/lib";


interface ReactIconProps {
  Icon: IconType;
  classname?:string
}

const ReactIcon = ({ Icon,classname }: ReactIconProps) => {
  return <Icon className={classname} />;
};

export default ReactIcon;