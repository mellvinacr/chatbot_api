"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MessagesSchema extends Schema {
  up() {
    this.create("messages", (table) => {
      table.increments(); // Kolom 'Id'
      table.string("sender_type").notNullable(); // Kolom 'sender_type', isinya 'user' atau 'bot'
      table.text("message").notNullable(); // Kolom 'Message', pakai .text() agar bisa panjang

      // Kolom untuk menghubungkan pesan ini ke sebuah percakapan
      table
        .integer("conversation_id")
        .unsigned()
        .references("id")
        .inTable("conversations")
        .onDelete("CASCADE");

      table.timestamps();
    });
  }

  down() {
    this.drop("messages");
  }
}

module.exports = MessagesSchema;
