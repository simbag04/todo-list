import { domController } from './dom-controller'
import { listController } from './list-controller';
import { lists } from './todo-list';
import './styles.css'

lists.addProject("Miscellaneous");

domController.initializeDom();
