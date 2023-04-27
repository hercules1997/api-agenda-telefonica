const cors = require("cors");
const express = require("express");
const uuid = require("uuid");
const port = process.env.PORT || 3003;
const app = express();
app.use(express.json());
app.use(cors());

const contatos = [];

//*?--- VERIFICAÇÃO PARA ENCONTRAR O CONTATO PELO ID ---?*//

const verificationRequestId = (request, response, next) => {
    const { id } = request.params;

    const index = contatos.findIndex((pedido) => pedido.id === id);

    if (index < 0) {
        return response.status(404).json({ mensage: "RESQUEST NOT FOUND" });
    }

    request.orderIndex = index;
    request.orderId = id;
    next();
};

app.get("/", (response) => {
    return response.json({ mensage: "Sucesso" });
});

//*?--- VERIFICAÇÃO PARA O RETORNO DA URL E DO TIPO DA ROTA ---?*//

const verificationRouteAndURL = (request, response, next) => {
    console.log(request.method);
    console.log(request.url);
    next();
};

//*?--- ROTA DE CRIAR USUARIO ---?*//

app.post("/cadastro", verificationRouteAndURL, (request, response) => {
    const { name, email, password } = request.body;
    const newContact = {
        id: uuid.v4(),
        name,
        email,
        password,
    };

    if (name && email && password !== "") {
        contatos.push(newContact);
    }

    return response.status(201).json(newContact);
});

//*?--- ROTA DE CONSULTA DE TODOS OS CONTATOS ---?*//

app.get("/contatos", verificationRouteAndURL, (request, response) => {
    return response.json(contatos);
});

//*?--- ROTA DE ATUALIZAÇÃO DO CONTATO ---?*//

app.put(
    "/contatos/:id",
    verificationRequestId,
    verificationRouteAndURL,
    (request, response) => {
        const index = request.orderIndex;
        const id = request.orderId;
        const { contact, email, password } = request.body;
        const updateRequest = {
            id,
            contact,
            email,
            password,
        };

        if (index < 0) {
            return response.status(404).json({ message: "Not found" });
        }

        contatos[index] = updateRequest;
        return response.json(updateRequest);
    }
);

//*?--- ROTA DE BUSCAR O CONTATO PELO ID ---?*//

app.get(
    "/contatos/:id",
    verificationRequestId,
    verificationRouteAndURL,
    (request, response) => {
        const index = request.orderIndex;
        const status = contatos[index];

        return response.json(status);
    }
);

//*?--- ROTA DE EDIÇÃO DO CONTATO ---?*//

app.patch(
    "/contatos/:id",
    verificationRequestId,
    verificationRouteAndURL,
    (request, response) => {
        const index = request.orderIndex;
        const upadateStatus = contatos[index];

        upadateStatus.status = "SEU PEDIO FOI FINALIZADO!";
        return response.json(upadateStatus);
    }
);

//*?---  ROTA DE EXCLUIR O PEDIDO  ---?*//

app.delete(
    "/contatos/:id",

    (request, response) => {
        const { id } = request.params;
        const index = contatos.findIndex((req) => req.id === id);

        contatos.splice(index, 1);
        return response.status(200), response.send({ message: "REQUEST DELETE!" });
    }
);

app.listen(port, () => {
    console.log(`${port}`);
});
