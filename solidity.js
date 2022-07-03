const express = require('express')
const solc = require('solc')
const fs = require('fs')
const path = require('path')

let abi
let bytecode

const app = express()

const PORT = 5000

app.use(express.json())

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/contract', (req, res) => {
    const {contract} = req.body

    // const contr = `// SPDX-License-Identifier: MIT
    // pragma solidity ^0.8.0;
    
    // import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
    // import "@openzeppelin/contracts/access/Ownable.sol";
    
    
    // contract SharkChasingToad is ERC1155, Ownable {
        
    //     string public name;

    //     constructor()
    //         ERC1155("ipfs://QmUusoGauKGU6EsGDLbqPiZK8PEnHDRYHa4c9yvJxhTHcg/metadata/{id}.json" )
        
    //     {
    //         setName('Toadd');
    //         for (uint i = 0; i < 1; i++) {
    //         _mint(msg.sender, i, 1, "");
    //         }
    //     }
        
    //     function setName(string memory _name) public onlyOwner {
    //         name = _name;
    //     }
    // }`

    const input = {
        language: 'Solidity',
        sources: {
          'test.sol': {
            content: contract
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      };
      
      function findImports(relativePath) {
        //my imported sources are stored under the node_modules folder!
        const absolutePath = path.resolve(__dirname, 'node_modules', relativePath);
        const source = fs.readFileSync(absolutePath, 'utf8');
        return { contents: source };
      }
      
      // New syntax (supported from 0.5.12, mandatory from 0.6.0)
      var output = JSON.parse(
        solc.compile(JSON.stringify(input), { import: findImports })
      );

      // `output` here contains the JSON output as specified in the documentation
        for (var contractName in output.contracts['test.sol']) {
            // console.log(
            // contractName +
            //     ': ' +
            //     output.contracts['test.sol'][contractName].evm.bytecode.object
            // );
            bytecode = output.contracts['test.sol'][contractName].evm.bytecode.object
            // interFace = output.contracts['test.sol'][contractName].evm.interface.object
            abi = output.contracts['test.sol'][contractName].abi
        }

    res.status(200).send({
        bytecode, abi
        // message: contractObject
    })
})

app.listen(PORT, () => console.log("App running on port " + PORT))
