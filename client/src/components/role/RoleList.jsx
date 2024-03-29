/*eslint-disable no-unused-vars*/
/*eslint-disable no-undef*/
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

const confirmDeletion = (callback, roleId) => {
  swal({
    title: 'Are you sure?',
    text: 'Would you like to delete this role?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Yes, delete it!',
    closeOnConfirm: false,
    closeOnCancel: false
  },
  (deletionConfirmed) => {
    if (deletionConfirmed) {
      callback(roleId);
      swal('Deleted!', 'The role has been deleted.', 'success');
    } else {
      swal('Cancelled!', 'The role was not deleted.', 'error');
    }
  });
};

const RoleList = ({ roles, deleteRole }) => {
  return (
    <table id="role_list" 
      className="highlight doc_list z-depth-4 panel pagination">
      <thead>
        <tr>
          <th>Role</th>
          <th>Created on</th>
          <th>Delete Role</th>
        </tr>
      </thead>

      <tbody>
        {roles.map(role =>
          <tr key={role.id}>
            <td className="role-title">{role.role}</td>
            <td>{moment(role.createdAt).format('L')}</td>
            {
                (role.role !== 'admin' && role.role !== 'regular' ?
                  <td><Link onClick={() => 
                  confirmDeletion(deleteRole, role.id)}>
                    <i className="small material-icons delete-btn">
                      delete
                      </i>
                    </Link>
                  </td>
                  : <td />
                )}
          </tr>
          )}
      </tbody>
    </table>
  );
};


RoleList.propTypes = {
  roles: React.PropTypes.array.isRequired
};

export default RoleList;
