/*eslint-disable no-unused-vars*/
import 'babel-polyfill';
import expect from 'expect';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import MyDocuments from 
'../../../client/src/components/MyDocuments.jsx';
import initialState from '../../../client/src/store/initialState';
import configureStore from '../../../client/src/store/configureStore';

const store = configureStore(initialState);


const wrapper = mount(
 <Provider store={store}>
    <MyDocuments documents={[]} />
  </Provider>
);


describe('MyDocuments component', () => {
  it('should mount the MyDocuments component', () => {
    expect(wrapper.containsMatchingElement(<MyDocuments />));
    expect(wrapper.find('Header').length).toBe(1);
    expect(wrapper.find('Sidebar').length).toBe(1);
    expect(wrapper.find('MyDocumentList').length).toBe(1);
  });
});

