import DocumentsRoute from './document';
import RolesRoute from './role';
import UsersRoute from './user';
import SearchRoute from './search';
import SwaggerRoute from './swagger';

/**
 * IndexRoute contains all the routes for the api
 */
class IndexRoute {
/**
 * Index IndexRoute for catch all
 * @param{Object} app express app
 * @return{Void} return void
 */
  static Index(app) {
    app.all('/api/*', (req, res) => {
      res.status(200).send({
        message: 'welcome to document management api'
      });
    });
  }

/**
 * Swagger Route
 * @param{Object} app express app
 * @return{Void} return void
 */
  static Swagger(app) {
    app.use('/api/swagger.json', SwaggerRoute);
  }

/**
 * Roles Route
 * @param{Object} app express app
 * @return{Void} return void
 */
  static Roles(app) {
    app.use('/api/roles', RolesRoute);
  }
/**
 * Users Route
 * @param{Object} app express app
 * @return{Void} return void
 */
  static Users(app) {
    app.use('/api/users', UsersRoute);
  }

  /**
 * Users Route
 * @param{Object} app express app
 * @return{Void} return void
 */
  static Search(app) {
    app.use('/api/search', SearchRoute);
  }

/**
 * Documents Route
 * @param{Object} app express app
 * @return{Void} return void
 */
  static Documents(app) {
    app.use('/api/documents', DocumentsRoute);
  }

}
export default IndexRoute;
