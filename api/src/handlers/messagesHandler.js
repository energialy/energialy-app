const { Messages, Companies } = require("../db");

const createMessage = async (req, res) => {
  const message = req.body;
  try {
    const newMessage = await Messages.create({
      text: message.text,
      file: message.file,
    });
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
};

const messageById = async (req, res) => {
  const { id } = req.params;
  try {
    const messageByUser = await Messages.findByPk(id, {
      include: {
        model: Companies,
        attributes: ['id', 'name'],
      },
    });
    return res.status(200).json(messageByUser);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = { createMessage, messageById };