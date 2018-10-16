import React, { Component } from 'react';
import './App.css';
import Amplify, { graphqlOperation } from "aws-amplify";
import { Connect } from "aws-amplify-react";

// TODO configure to point to your API
Amplify.configure({
  'aws_appsync_region': 'us-west-2',
  'aws_appsync_authenticationType': 'API_KEY',
  'aws_appsync_graphqlEndpoint': '...',
  'aws_appsync_apiKey': '...'
});

// GraphQL query to get list of commands.
const ListColorCommands = `
query listColorCommands {
  listColorCommands {
    items {
      id
      timestamp
      color
    }
  }
}
`;

// GraphQL query to subscribe to new commands.
const OnCreateColorCommandSubscription = `
subscription onCreateColorCommand {
  onCreateColorCommand {
    __typename
    id
    color
    timestamp
  }
}
`;

class App extends Component {
  render() {
    const ListView = ({ commands }) => (
      <div>
        <h2>All commands</h2>
        <ul>
          {commands.map(command => <li key={command.id}>[{command.timestamp} {command.id}] {command.color}</li>)}
        </ul>
      </div>
    );

    return (
      <Connect query={graphqlOperation(ListColorCommands)}
        subscription={graphqlOperation(OnCreateColorCommandSubscription)}
        onSubscriptionMsg={(prev, { onCreateColorCommand }) => 
          {
            const { listColorCommands: { items } } = prev;
            items.push(onCreateColorCommand);
            return prev;
          }
        }
        >
        {({ data: { listColorCommands } }) => (
          listColorCommands && <ListView commands={listColorCommands.items} />
        )
        }
      </Connect>
    );
  }
}

export default App;
