const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userController = {};

userController.showAll = async (req, res, next) => {
    try {
        const users = await User.find();
        const currentUser = await User.findById(req.user._id); // Obtém o usuário atual
        res.render('users/index', { users, currentUser });
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).send('Erro ao buscar usuários');
    }
};

userController.show = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        const currentUser = await User.findById(req.user._id); // Obtém o usuário atual
        res.render('users/show', { user, currentUser });
    } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        res.status(500).send('Erro ao buscar usuário');
    }
};

userController.edit = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.render('users/edit', { user });
    } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        res.status(500).send('Erro ao buscar usuário');
    }
};

userController.update = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updateData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        };

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }

        if (req.body.oldPassword && req.body.newPassword) {
            const passwordIsValid = bcrypt.compareSync(req.body.oldPassword, user.password);
            if (!passwordIsValid) {
                return res.status(401).send('Senha antiga inválida');
            }
            const hashedNewPassword = bcrypt.hashSync(req.body.newPassword, 8);
            updateData.password = hashedNewPassword;
        }

        await User.findByIdAndUpdate(userId, updateData);
        res.redirect('/backoffice/users');
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).send('Erro ao atualizar usuário');
    }
};

userController.delete = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/backoffice/users');
    } catch (err) {
        console.error('Erro ao deletar usuário:', err);
        res.status(500).send('Erro ao deletar usuário');
    }
};

userController.follow = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const userToFollow = await User.findById(req.params.id);

        if (!userToFollow || currentUser._id.equals(userToFollow._id)) {
            return res.status(400).send('Operação inválida');
        }

        if (!currentUser.following.includes(userToFollow._id)) {
            currentUser.following.push(userToFollow._id);
            await currentUser.save();
        }
        res.redirect('/backoffice/users');
    } catch (err) {
        console.error('Erro ao seguir usuário:', err);
        res.status(500).send('Erro ao seguir usuário');
    }
};

userController.unfollow = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const userToUnfollow = await User.findById(req.params.id);

        if (!userToUnfollow || currentUser._id.equals(userToUnfollow._id)) {
            return res.status(400).send('Operação inválida');
        }

        currentUser.following = currentUser.following.filter(userId => !userId.equals(userToUnfollow._id));
        await currentUser.save();
        res.redirect('/backoffice/users');
    } catch (err) {
        console.error('Erro ao deixar de seguir usuário:', err);
        res.status(500).send('Erro ao deixar de seguir usuário');
    }
};

module.exports = userController;
