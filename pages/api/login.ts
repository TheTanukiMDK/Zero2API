import type {  NextApiRequest, NextApiResponse } from "next";
import bcypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface User {
    id:1;
    username: string;
    password: string;
}

interface LoginResponse{
    token?: string;
    error?: string;
}

//Simulación de registro en base de datos
const users:User[] = [
    {
    id: 1,
    username: "guayabo2",
    password: "1234",
    }
];

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LoginResponse>
) {
    const {method} = req;

    if (method == 'POST'){
        const { username, password } = req.body;

        //Buscar el usuario en la base de datos (es un arreglo en esta caso)
        const userBd = users.find((u) => u.username === username);

        if (!userBd){
            
            return res.status(401).json({error:'Usuario no encontrado'});
        }

        //const isPasswordValid = await bcypt.compare(password, userBd.password);

        //if (!isPasswordValid){
            //return res.status(401).json({error:'Contraseña incorrecta'});
        //}

        //Generamos el token JWT
        const token = jwt.sign(
            {userId: userBd.id, userName: userBd.username},
            process.env.JWT_SECRET as string,
            {expiresIn: '1h'}
        );

        return res.status(200).json({token});
    }

    if (method != 'POST'){
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Método ${method} no permitido`);
    }


}