import JSONPretty from 'react-json-pretty';

const JSONPrettyMon = {
  main: 'line-height:1.3;color:grey;background:transparent;overflow:auto;',
  error: 'line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;',
  key: 'color:#f92672;',
  string: 'color:#fd971f;',
  value: 'color:#a6e22e;',
  boolean: 'color:red;',
};

export default function PrettJsonComponent(props: {data: any}) {
  return <JSONPretty theme={JSONPrettyMon} data={props.data}></JSONPretty>;
}
