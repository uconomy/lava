import { LIGOFlavors } from '../../../modules/ligo';

// Contract code is stolen from https://ligolang.org homepage examples
const src = {
  [LIGOFlavors.PascaLIGO]: {
    extension: "ligo",
    code: "type storage is int\n\ntype parameter is\n  Increment of int\n| Decrement of int\n| Reset\n\ntype return is list (operation) * storage\n\n// Two entrypoints\n\nfunction add (const store : storage; const delta : int) : storage is \n  store + delta\n\nfunction sub (const store : storage; const delta : int) : storage is \n  store - delta\n\n(* Main access point that dispatches to the entrypoints according to\n   the smart contract parameter. *)\n\nfunction main (const action : parameter; const store : storage) : return is\n ((nil : list (operation)),    // No operations\n  case action of\n    Increment (n) -> add (store, n)\n  | Decrement (n) -> sub (store, n)\n  | Reset         -> 0\n  end)\n"
  },
  [LIGOFlavors.CameLIGO]: {
    extension: "mligo",
    code: "type storage = int\n\ntype parameter =\n  Increment of int\n| Decrement of int\n| Reset\n\ntype return = operation list * storage\n\n// Two entrypoints\n\nlet add (store, delta : storage * int) : storage = store + delta\nlet sub (store, delta : storage * int) : storage = store - delta\n\n(* Main access point that dispatches to the entrypoints according to\n   the smart contract parameter. *)\n\nlet main (action, store : parameter * storage) : return =\n ([] : operation list),    // No operations\n (match action with\n   Increment (n) -> add (store, n)\n | Decrement (n) -> sub (store, n)\n | Reset         -> 0)\n"
  },
  [LIGOFlavors.ReasonLIGO]: {
    extension: "religo",
    code: "type storage = int;\n\ntype parameter =\n  Increment (int)\n| Decrement (int)\n| Reset;\n\ntype return = (list (operation), storage);\n\n// Two entrypoints\n\nlet add = ((store, delta) : (storage, int)) : storage => store + delta;\nlet sub = ((store, delta) : (storage, int)) : storage => store - delta;\n\n/* Main access point that dispatches to the entrypoints according to\n   the smart contract parameter. */\n\nlet main = ((action, store) : (parameter, storage)) : return => {\n (([] : list (operation)),    // No operations\n (switch (action) {\n  | Increment (n) => add ((store, n))\n  | Decrement (n) => sub ((store, n))\n  | Reset         => 0}))\n};\n"
  },
  [LIGOFlavors.JsLIGO]: {
    extension: "jsligo",
    code: 'type storage = int;\n\ntype parameter =\n| ["Increment", int]\n| ["Decrement", int]\n| ["Reset"];\n\ntype return_ = [list <operation>, storage];\n\n/* Two entrypoints */\n\nlet add = ([store, delta] : [storage, int]) : storage => store + delta;\nlet sub = ([store, delta] : [storage, int]) : storage => store - delta;\n\n/* Main access point that dispatches to the entrypoints according to\n   the smart contract parameter. */\n\nlet main = ([action, store] : [parameter, storage]) : return_ => {\n return [\n   (list([]) as list <operation>),    // No operations\n   (match (action, {\n    Increment: (n: int) => add ([store, n]),\n    Decrement: (n: int) => sub ([store, n]),\n    Reset:     ()  => 0}))\n  ]\n};\n'
  }
}

export const makeContractFile = (flavor: LIGOFlavors) => src[flavor].code;
export const getContractFileName = (flavor: LIGOFlavors, name: string) => `${name}.${src[flavor].extension}`;
