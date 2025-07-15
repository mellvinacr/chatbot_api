'use strict'

// Ganti import dengan require
const Conversation = use('App/Models/Conversation')
const Message = use('App/Models/Message')
const { v4: uuidv4 } = require('uuid')
const axios = require('axios')

class ChatController {
  /**
   * Method ini akan dieksekusi saat ada request POST /questions
   * @param {object} ctx
   * @param {import('@adonisjs/framework/src/Request')} ctx.request
   * @param {import('@adonisjs/framework/src/Response')} ctx.response
   */
  async store ({ request, response }) {
    try {
      // 1. Ambil pertanyaan dari input pengguna
      const { question } = request.only(['question'])

      // Pastikan ada pertanyaan
      if (!question) {
        return response.status(400).send({ error: 'Pertanyaan tidak boleh kosong' })
      }

      // 2. Buat session_id acak
      const sessionId = uuidv4()

      // 3. Buat record percakapan baru di database
      const conversation = await Conversation.create({
        session_id: sessionId,
      })

      // 4. Simpan pesan dari pengguna ke database
      await Message.create({
        conversation_id: conversation.id,
        sender_type: 'user',
        message: question,
      })

      // 5. Kirim pertanyaan ke API eksternal
      const externalApiResponse = await axios.post('https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message', {
        question: question
      })

      // 6. Ambil jawaban dari bot
      const botAnswer = externalApiResponse.data.data.answer

      // 7. Simpan pesan dari bot ke database
      await Message.create({
        conversation_id: conversation.id,
        sender_type: 'bot',
        message: botAnswer,
      })
      
      // 8. Update pesan terakhir di tabel conversation
      conversation.last_message = botAnswer
      await conversation.save()

      // 9. Kembalikan jawaban bot ke pengguna
      return response.ok({
        answer: botAnswer
      })

    } catch (error) {
      console.error('Error di ChatController:', error.response ? error.response.data : error.message)
      return response.status(500).send({ error: 'Terjadi kesalahan pada server' })
    }
  }
}

module.exports = ChatController