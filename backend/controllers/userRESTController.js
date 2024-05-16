const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Exibir todos os usuários
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render('users/index', { users });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro ao buscar usuários');
  }
};

// Exibir formulário de criação de usuário
exports.showCreateUserForm = (req, res) => {
  res.render('users/create');
};

// Criar um novo usuário
exports.createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role
    });

    await newUser.save();
    res.redirect('/backoffice/users');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).send('Erro ao criar usuário: ' + error);
  }
};

// Exibir formulário de edição de usuário
exports.showEditUserForm = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    res.render('users/edit', { user });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).send('Erro ao buscar usuário');
  }
};

// Editar um usuário existente
exports.editUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    };

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 8);
      updateData.password = hashedPassword;
    }

    await User.findByIdAndUpdate(userId, updateData);
    res.redirect('/backoffice/users');
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).send('Erro ao atualizar usuário: ' + error);
  }
};
