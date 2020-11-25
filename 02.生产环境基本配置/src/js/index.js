import 'core-js/modules/es.object.to-string';
import 'core-js/modules/es.promise';
import 'core-js/modules/web.timers';
// import '@babel/polyfill';
import '../style/index.css';
import '../style/index.less';

const webpackTest = function webpackTest() {
  // eslint-disable-next-line
  console.log('webpackTest');
};

webpackTest();
const promiseTest = new Promise((resolve) => {
  setTimeout(() => {
    resolve(console.log('定时器执行完'));
  }, 2000);
});
console.log(promiseTest.then());
