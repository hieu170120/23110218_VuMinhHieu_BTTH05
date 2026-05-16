const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/user');
const bcrypt = require('bcrypt');

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        const email = 'admin@gmail.com';
        let user = await User.findOne({ email });
        
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log('Đã cập nhật role của admin@gmail.com thành admin');
        } else {
            const hashPassword = await bcrypt.hash('123456', 10);
            await User.create({
                name: 'Administrator',
                email,
                password: hashPassword,
                role: 'admin'
            });
            console.log('Đã tạo tài khoản admin@gmail.com với mật khẩu: 123456');
        }
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}
makeAdmin();
