const { User } = require('../models');
const { signToken } = require('../utils/auth')
const { AuthenticationError } = require('apollo-server-express')

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if(context.user){
          const userDate = await User.findOne({ _id: context.user._id})
         .select('-_v -password')
         .populate('books');

          return userDate;
      }
      throw new AuthenticationError('Not logged in');
    }
  },
  Mutation: {
    login: async (parent, {email, password}) => {
      const user = await User.findOne({email});
      
      if(user === false){
          throw new AuthenticationError('invalid username')
      }

      
      const checkPassword = user.isCorrectPassword(password);

      if(checkPassword === false){
          throw new AuthenticationError('invalid password')
      }
        

    },
    addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
        return { token,user};
    },
    saveBook: async (parent, { book }, context) => {
        if (context.user) {
            const user = await User.findByIdAndUpdate(
                {_id: context.user._id },
                { $push: { savedBooks: book} },
                { new: true}
            );
            return user;
        }
        throw new AuthenticationError('Not logged in');
    },
    removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const user = await User.findByIdAndUpdate(
                {_id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId} } },
            );
            return user;
        }
        throw new AuthenticationError(' Not logged in');
    }

  }
};

module.exports = resolvers;
