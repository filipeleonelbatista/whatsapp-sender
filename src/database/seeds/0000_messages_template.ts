import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("messages-template").del();

    // Inserts seed entries
    await knex("messages-template").insert([
        {
            id: 1,
            title: "Modelo 1",
            message: "Olá {primeiroNome}, esta mensagem é o *modelo 1*",
            filearray: [],
            updated_at: new Date(Date.now()).toISOString(),
        },
        {
            id: 2,
            title: "Modelo 2",
            message: "Olá {primeiroNome}, esta mensagem é o *modelo 2*",
            filearray: [],
            updated_at: new Date(Date.now()).toISOString(),
        },
    ]);
};
