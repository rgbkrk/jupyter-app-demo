import * as React from "react";

export default props => {
  return (
    <pre>
      {JSON.stringify(props.messageCollections, null, 2)}
    </pre>
  );
};
