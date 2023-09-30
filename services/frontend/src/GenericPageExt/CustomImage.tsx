function CustomImageComponent(props: {
  path: string;
  responsive?: boolean;
  width?: string | number;
}) {
  const path = props.path;
  const style: {width?: string | number; height?: string} = {};
  if (props.responsive === true) {
    style.width = '100%';
    style.height = 'auto';
  } else if (props.width) style.width = props.width;

  // const { src } = useImage({ srcList: path });
  // const { src } = path });

  // <Suspense>
  return <img alt="" src={path} style={style} />;
  // </Suspense>
}

export default CustomImageComponent; //() {
/*  return (
    <Suspense>
      <ImageComponent />
    </Suspense>
  )
}*/

// export default ImageComponent;
