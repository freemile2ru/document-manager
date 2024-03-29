import model from '../models';

const Roles = model.Role;
/**
 * Class to implement Role controlllers
 */
class RoleController {
  /**
   * Method to verify the creation of a new Role
   * @param{Object} request - Request Object
   * @return{Object} - Return request parameters
   */
  static postRole(request) {
    return (
      request.body &&
      request.body.role
    );
  }
  /**
   * Method to create a new Role
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - Returns void
   */
  static createRole(request, response) {
    if (RoleController.postRole(request)) {
      return Roles
        .create({
          role: request.body.role
        })
        .then(role => {
          return response.status(201).send(role)});
    }
    response.status(500).send({
      success: false,
    });
  }
  /**
   * Method to fetch Roles
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - Returns void
   */
  static fetchRoles(request, response) {
    Roles.findAll({})
      .then(role => response.status(200).send(role))
      .catch((error) => {
        response.status(404).send({
          success: false,
          message: error.message
        });
      })
  }
  /**
   * Method to delete a Role
   * @param{Object} request - Request Object
   * @param{Object} response - Response Object
   * @return{Void} - Returns void
   */
  static deleteRole(request, response) {
    if(!parseInt(request.params.id)){
      return response.status(400)
      .send({ 
        success: false,
        message: 'Invalid query params'
      });
    }
    Roles.findOne({ where: { id: request.params.id } })
      .then((role) => {
        if (role) {
          role.destroy()
            .then(() => response.status(200).send({
              success: true,
              message: 'Role Successfully deleted from database'
            }));
        } else {
          response.status(404).send({
            success: false,
            message: 'Role not found'
          });
        }
      }).catch(error => response.status(401).send(error));
  }

}
export default RoleController;
