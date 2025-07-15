'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ConversationsSchema extends Schema {
  up () {
    this.create('conversations', (table) => {
      table.increments() // Kolom 'id'
      table.string('session_id').notNullable().unique() // Kolom 'session_id', tidak boleh kosong & harus unik
      table.string('last_message').nullable() // Kolom untuk pesan terakhir, boleh kosong
      table.timestamps() // Kolom 'created_at' dan 'updated_at'
    })
  }

  down () {
    this.drop('conversations')
  }
}

module.exports = ConversationsSchema
