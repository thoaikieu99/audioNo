const crypto = require("crypto")
const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const creatModelUser = (sequelize) => {
    const User = sequelize.define(
        "User",
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    function(val) {
                        if (val.length < 5) {
                            throw new Error("Please choose a longer username, min 6 ");
                        }
                    },
                    notNull: {
                        args: [true],
                        msg: 'The password field cannot be empty.'
                    },

                }
            },
            password_hash: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    len: {
                        args: [8, 99],
                        msg: 'Your password must contain at least 8 characters.',
                    },
                    notNull: {
                        args: [true],
                        msg: 'The password field cannot be empty.'
                    },

                }
            },
            confirmedPassword: {
                type: DataTypes.VIRTUAL,
                allowNull: false,
                validate: {
                    function(val) {
                        if (val !== this.password_hash) {
                            throw new Error("Password not same")
                        }
                    },
                    notNull: {
                        args: [true],
                        msg: 'The password confirmed field cannot be empty.'
                    },

                }
            },
            role: {
                type: DataTypes.ENUM,
                values: ["0", "1", "2"],
                defaultValue: "0",
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        args: [true],
                        msg: 'The Email field cannot be empty.'
                    },
                    isEmail: {
                        args: [true],
                        msg: 'email is invalid'
                    }
                }
            },
            passwordChangedAt: {
                type: DataTypes.DATE,
            },
            passwordResetToken: {
                type: DataTypes.STRING,
            },
            passwordResetExpries: {
                type: DataTypes.DATE,
            }
        },
        {
            password: false,
            tableName: "Users",
            defaultScope: {
                attributes: {
                    exclude: ['password_hash']
                }
            },
            scopes: {
                withPassword: {
                    attributes: {
                        include: ['password_hash']
                    }
                }
            },
            // hooks: {
            //     beforeCreate: async (user) => {
            //         if (user.password_hash) {
            //             user.password_hash = await bcrypt.hash(user.password_hash, 10);
            //             user.passwordChangedAt = new Date();
            //             user.confirmedPassword = undefined;
            //         }
            //     },
            //     beforeUpdate: async (user) => {
            //         if (user.password) {
            //             user.password_hash = await bcrypt.hash(user.password_hash, 10);
            //             user.confirmedPassword = undefined;
            //         }
            //     }
            // }

        }
    );
    User.addHook('beforeUpdate', async (user, options) => {
        if (user.password_hash) {
            user.password_hash = await bcrypt.hash(user.password_hash, 10);

        }
    });
    User.addHook('beforeCreate', async (user, options) => {
        if (user.password_hash) {
            user.password_hash = await bcrypt.hash(user.password_hash, 10);
            user.confirmedPassword = undefined;
        }
    });
    User.addHook('beforeSave', async (user, options) => {
        if (user.changed('password_hash')) {
            console.log("changge")
            user.passwordChangedAt = new Date() - 1000;
        }
    });
    User.prototype.validatePassword = async function (password) {
        return await bcrypt.compare(password, this.password_hash);

    };
    User.prototype.changePasswordAfter = function (JWTTimestamp) {
        return JWTTimestamp > this.passwordChangedAt.getTime() / 1000;;
    };
    User.prototype.createResetPassword = function () {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.passwordResetExpries = Date.now() + 10 * 60 * 1000;
        return resetToken;
    };

    return User;
}

module.exports = creatModelUser;