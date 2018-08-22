import * as React from "react";
import Debug from "../components/debug";

import PresentationCell from "../components/presentation-cell";
import CodeState from "../components/code-state";

const messaging = require("@nteract/messaging");

import { Kernel } from "@mybinder/host-cache";
const { WideLogo } = require("@nteract/logos");

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      source: "import this",
      parentMessageId: null
    };
  }

  render() {
    let outputs = null;

    if (this.state.parentMessageId) {
      outputs = (
        <pre>
          {JSON.stringify(
            this.props.messageCollections[
              this.state.parentMessageId
            ],
            null,
            2
          )}
        </pre>
      );
    }

    return (
      <div
        style={{
          paddingBottom: "10px"
        }}
      >
        <textarea
          style={{
            width: "100%",
            border: "1px solid DeepPink",
            height: "300px"
          }}
          onChange={event =>
            this.setState({ source: event.target.value })
          }
          value={this.state.source}
        />
        <button
          onClick={() => {
            const message = messaging.executeRequest(
              this.state.source
            );

            console.log(message);

            this.setState({
              parentMessageId: message.header.msg_id
            });

            this.props.kernel.channels.next(message);
          }}
        >
          Click me!
        </button>
        {outputs}
      </div>
    );
  }
}

const Index = () => {
  return (
    <div className="app">
      <Kernel
        repo="binder-examples/requirements"
        kernelName="python3"
      >
        <Kernel.Consumer>
          {kernel =>
            kernel ? (
              <CodeState kernel={kernel}>
                <Editor />
                <PresentationCell />
                <Debug />
              </CodeState>
            ) : (
              <div>No kernel yet</div>
            )
          }
        </Kernel.Consumer>
      </Kernel>
      <style jsx>{`
        .app {
          padding: 30px;
          font-family: -apple-system, system-ui, "Segoe UI",
            Helvetica, Arial, sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
        }

        header {
          font-size: 1em;
          padding-bottom: 20px;
        }
        code {
          font-size: 1.3em;
          background-color: hsl(10, 0%, 90%);
          padding: 2px;
        }
      `}</style>
    </div>
  );
};

export default Index;
