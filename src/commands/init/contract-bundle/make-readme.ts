import { Bundle } from "../../../bundle";

export const makeREADME = (bundle: Bundle) =>
`# ${bundle.name}

## Preparation
To start using this contract, make sure you have all the needed packages to run it. To do so, in your Terminal just type:
\`\`\`sh
npm install
\`\`\`

## Usage
To deploy this contract, simply run
\`\`\`sh
npm tezos deploy --net=local
\`\`\`
`;
