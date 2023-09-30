function IconImageComponent(props: {
  color?: 'black';
  height?: string | number;
  src: string;
}) {
  // const src = props.color === 'black' ? '/cl_logo_2.png' : '/cl_logo_2.png';

  const style: {height?: string | number} = {};
  if (props.height) style.height = props.height;
  return <img alt="" src={props.src} style={style} />;
}

export default IconImageComponent;
