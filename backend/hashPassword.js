const bcrypt = require('bcryptjs');

async function hashPassword() {
    const password = 'field123'; // Password for our field user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hashedPassword);
}

hashPassword();