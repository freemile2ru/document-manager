/* eslint import/no-extraneous-dependencies: 0 */
/* eslint import/no-unresolved: 0 */
import model from '../models';
import Authenticator from '../middleware/authenticator';
import DocumentHelper from './helper/DocumentHelper';

const Users = model.User;

/**
 * Controller for Users
 */
class UserController {
    /**
     * Method to set the various document routes
     * @param{Object} req - Server req
     * @return{Object} return req parameters
     */
  static postreq(req) {
    return (
        req.body &&
        req.body.username &&
        req.body.firstname &&
        req.body.lastname &&
        req.body.password &&
        req.body.email
    );
  }

  /**
   * Method used to create new user
   * @param{Object} req - Server req
   * @param{Object} res - Server res
   * @returns{Void} return Void
   */
  static createUser(req, res) {
    if (UserController.postreq(req)) {
      return Users
        .create({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          RoleId: 2
        }).then(user => res.status(201).send({
          success: true,
          message: 'User successfully signed up',
          RoleId: user.RoleId,
          token: Authenticator.generateToken(user)
        })).catch(error => res.status(409).send({
          success: UserController.postreq(req),
          message: error.message,
          error: error.errors[0].message
        }));
    }
    res.status(400).send({
      success: false,
      message: 'You did not input your field properly'
    });
  }

 /**
   * Method used to login a user
   * @param{Object} req - Server req
   * @param{Object} res - Server res
   * @returns{Void} return Void
   */
  static loginUser(req, res) {
    Users.findOne({
      where: {
        email: req.body.email
      }
    })
      .then((user) => {
        if (user && user.passwordMatched(req.body.password)) {
          const token = Authenticator.generateToken(user);
          res.status(200).send({
            message: 'login successfully',
            token,
            expiresIn: 86400
          });
        } else {
          res.status(401).send({
            success: false,
            message: 'Failed to Authenticator User, Invalid Credentials'
          });
        }
      });
  }
  /**
   * Method used to logout user
   * @param{Object} req - Server req
   * @param{Object} res - Server res
   * @returns{Void} return Void
   */
  static logoutUser(req, res) {
    res.send({
      success: true,
      message: 'User logged out successfully'
    });
  }



/**
 * Method used to fetch all users
 * @param{Object} req - Server req
 * @param{Object} res - Server res
 * @returns{Void} return Void
 */
  static fetchAllUsers(req, res) {
    let query = {
      limit: 10,
      offset: 0
    };
    if (req.query.limit && req.query.offset) {
      if(!parseInt(req.query.limit)){
        return res.status(400)
        .send({ 
          success: false,
          message: 'Invalid query params'
         });
      }
      query = {
        limit: req.query.limit,
        offset: req.query.offset,
        order: '"createdAt" DESC',
      };
    }
    Users.findAndCountAll(query)
      .then((users) => {
        users.rows = users.rows.map(user => {
          delete user.dataValues.password;
          return user.dataValues;
        })
        const paginateResult = DocumentHelper
        .paginateResult(users, query.offset, query.limit);
        res.status(200).send({
          success: true,
          users: users.rows,
          pagination: paginateResult
         });
      })
  }

  /**
 * Method used to fetch user by their ID
 * @param{Object} req - Server req
 * @param{Object} res - Server res
 * @returns{Void} return Void
 */
  static fetchUser(req, res) {
    if(!parseInt(req.params.id)){
      return res.status(400)
      .send({ 
        success: false,
        message: 'Invalid query params'
      });
    }
    Users.findOne({ where: { id: req.params.id } })
      .then((user) => {
        if (user) {    
          delete user.dataValues.password;
          return res.status(200)
          .send({
            success: true,
            user
          });
        } else {
          res.status(404).send({
            success: false,
            message: 'User not found'
          });
        }
      });
  }

   /**
   * Method used to Update user info
   * @param{Object} req - Server req
   * @param{Object} res - Server res
   * @returns{Void} return Void
   */
  static updateUser(req, res) {
    const UserId = req.decoded.UserId;
    let RoleId = req.decoded.RoleId;
    if(!parseInt(req.params.id)){
      return res.status(400)
      .send({ 
        success: false,
        message: 'Invalid query params'
      });
    }
    Users.findOne({
      where: { id: req.params.id }
    }).then((user) => {
      if (user) {
        if (RoleId === 1) {
          user.update(req.body, {fields: Object.keys(req.body)})
            .then((updatedUser) => { 
              delete updatedUser.dataValues.password;
              return res.status(200)
              .send({
                success: true,
                updatedUser
              })
            });
        } else if (UserId === user.id && RoleId === 2) {
          const updateProps = Object.keys(req.body);        
          user.update(req.body, {fields: updateProps})
          .then(updatedUser => {
            return res.status(200)
            .send({
              success: true,
              updatedUser
             })
          });
        } else {
          res.status(401).send({
            success: false,
            message: 'Unauthorized'
          });
        }
      } else {
        res.status(404).send({
          success: false,
          message: 'User not found'
        });
      }
    }).catch((error) => {
      res.status(401).send({
        success: false,
        message: error.message
      });
    });
  }

/**
 * Method used to delete user
 * only accessible to admin
 * @param{Object} req - Server req
 * @param{Object} res - Server res
 * @returns{Void} return Void
 */
  static deleteUser(req, res) {
    if(!parseInt(req.params.id)){
      return res.status(400)
      .send({ 
        success: false,
        message: 'Invalid query params'
      });
    }
    Users.findOne({ where: { id: req.params.id } })
      .then((user) => {
        if (user) {
          user.destroy()
            .then(() => res.status(200).send({
              success: true,
              message: 'User Successfully deleted from database'
            }));
        } else {
          res.status(404).send({
            success: false,
            message: 'User not found'
          });
        }
      });
  }

  /**
 * Method used to create admin user, only accessible to admin user(s).
 * @param{Object} req - Server req
 * @param{Object} res - Server res
 * @returns{Void} return Void
 */
  static createAdmin(req, res) {
    Users.create({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
      email: req.body.email,
      RoleId: 1
    }).then((adminUser) => {
      res.status(201).send({
        success: false,
        message: 'Admin user successfully created',
        RoleId: adminUser.RoleId,
        token: Authenticator.generateToken(adminUser)
      });
    }).catch((error) => {
      res.status(409).send({
        success: false,
        message: error.message,
        error: error.errors[0].message
      });
    });
  }

/**
 * Fetch specific document in the database
 * Admin has access to all the documents
 * Users only have access to their private
 * documents and all other public documents.
 * @param{Object} req - Server req
 * @param{Object} res - Server res
 * @return {Void} - returns Void
 */
  static searchUsers(req, res) {
    let query = {
      limit: 10,
      offset: 0
    };
    
    if (req.query.limit || req.query.offset) {
       query = {
         limit: req.query.limit,
         offset: req.query.offset || 0
       };
    }
    if (req.query.search) {
        let searchQuery = req.query.search;
        searchQuery = DocumentHelper.sanitizeString(searchQuery);
        query.where = {
          $or:
          [
            {
              username: { $iLike: `%${searchQuery}%` }
            }, {
              firstname: { $iLike: `%${searchQuery}%` }
            }, {
              lastname: { $iLike: `%${searchQuery}%` }
            }, {
              email: { $iLike: `%${searchQuery}%` }
            }
          ]
        };
      Users.findAndCountAll(query)
        .then((users) => {
          users.rows = users.rows.map(user => {
            delete user.dataValues.password;
            return user.dataValues;
         })
        const paginateResult = DocumentHelper
          .paginateResult(users, query.offset, query.limit);
          res.status(200).send({
            success: true,
            users: users.rows,
            pageCount: paginateResult.pageCount
          });
        })
        .catch((err) => {
          res.status(500).send({ error: err.message });
        });
      } else {
       res.status(400).send({
         success: false,
         message: 'please enter a search parameter'
       });
      }    
    }
  }
export default UserController;
