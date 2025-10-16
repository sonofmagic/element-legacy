/* Automatically generated don't modify this file! */

import Pagination from '../packages/pagination/index';
import Dialog from '../packages/dialog/index';
import Autocomplete from '../packages/autocomplete/index';
import Dropdown from '../packages/dropdown/index';
import DropdownMenu from '../packages/dropdown-menu/index';
import DropdownItem from '../packages/dropdown-item/index';
import Menu from '../packages/menu/index';
import Submenu from '../packages/submenu/index';
import MenuItem from '../packages/menu-item/index';
import MenuItemGroup from '../packages/menu-item-group/index';
import Input from '../packages/input/index';
import InputNumber from '../packages/input-number/index';
import Radio from '../packages/radio/index';
import RadioGroup from '../packages/radio-group/index';
import RadioButton from '../packages/radio-button/index';
import Checkbox from '../packages/checkbox/index';
import CheckboxButton from '../packages/checkbox-button/index';
import CheckboxGroup from '../packages/checkbox-group/index';
import Switch from '../packages/switch/index';
import Select from '../packages/select/index';
import Option from '../packages/option/index';
import OptionGroup from '../packages/option-group/index';
import Button from '../packages/button/index';
import ButtonGroup from '../packages/button-group/index';
import Table from '../packages/table/index';
import TableColumn from '../packages/table-column/index';
import DatePicker from '../packages/date-picker/index';
import DatePickerV2 from '../packages/date-picker-v2/index';
import TimeSelect from '../packages/time-select/index';
import TimePicker from '../packages/time-picker/index';
import Popover from '../packages/popover/index';
import Tooltip from '../packages/tooltip/index';
import MessageBox from '../packages/message-box/index';
import Breadcrumb from '../packages/breadcrumb/index';
import BreadcrumbItem from '../packages/breadcrumb-item/index';
import Form from '../packages/form/index';
import FormItem from '../packages/form-item/index';
import Tabs from '../packages/tabs/index';
import TabPane from '../packages/tab-pane/index';
import Tag from '../packages/tag/index';
import Tree from '../packages/tree/index';
import Alert from '../packages/alert/index';
import Notification from '../packages/notification/index';
import Slider from '../packages/slider/index';
import Loading from '../packages/loading/index';
import Icon from '../packages/icon/index';
import Row from '../packages/row/index';
import Col from '../packages/col/index';
import Upload from '../packages/upload/index';
import Progress from '../packages/progress/index';
import Spinner from '../packages/spinner/index';
import Message from '../packages/message/index';
import Badge from '../packages/badge/index';
import Card from '../packages/card/index';
import Rate from '../packages/rate/index';
import Steps from '../packages/steps/index';
import Step from '../packages/step/index';
import Carousel from '../packages/carousel/index';
import Scrollbar from '../packages/scrollbar/index';
import CarouselItem from '../packages/carousel-item/index';
import Collapse from '../packages/collapse/index';
import CollapseItem from '../packages/collapse-item/index';
import Cascader from '../packages/cascader/index';
import ColorPicker from '../packages/color-picker/index';
import Transfer from '../packages/transfer/index';
import Container from '../packages/container/index';
import Header from '../packages/header/index';
import Aside from '../packages/aside/index';
import Main from '../packages/main/index';
import Footer from '../packages/footer/index';
import Timeline from '../packages/timeline/index';
import TimelineItem from '../packages/timeline-item/index';
import Link from '../packages/link/index';
import Divider from '../packages/divider/index';
import Image from '../packages/image/index';
import Calendar from '../packages/calendar/index';
import Backtop from '../packages/backtop/index';
import InfiniteScroll from '../packages/infinite-scroll/index';
import PageHeader from '../packages/page-header/index';
import CascaderPanel from '../packages/cascader-panel/index';
import Avatar from '../packages/avatar/index';
import Drawer from '../packages/drawer/index';
import Statistic from '../packages/statistic/index';
import Popconfirm from '../packages/popconfirm/index';
import Skeleton from '../packages/skeleton/index';
import SkeletonItem from '../packages/skeleton-item/index';
import Empty from '../packages/empty/index';
import Descriptions from '../packages/descriptions/index';
import DescriptionsItem from '../packages/descriptions-item/index';
import Result from '../packages/result/index';
import locale from 'element-ui/src/locale';
import CollapseTransition from 'element-ui/src/transitions/collapse-transition';

const components = [
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  DatePickerV2,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Spinner,
  Badge,
  Card,
  Rate,
  Steps,
  Step,
  Carousel,
  Scrollbar,
  CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Timeline,
  TimelineItem,
  Link,
  Divider,
  Image,
  Calendar,
  Backtop,
  PageHeader,
  CascaderPanel,
  Avatar,
  Drawer,
  Statistic,
  Popconfirm,
  Skeleton,
  SkeletonItem,
  Empty,
  Descriptions,
  DescriptionsItem,
  Result,
  CollapseTransition
];

const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);

  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.use(InfiniteScroll);
  Vue.use(Loading.directive);

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };

  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  CollapseTransition,
  Loading,
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  DatePickerV2,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  MessageBox,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Notification,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Spinner,
  Message,
  Badge,
  Card,
  Rate,
  Steps,
  Step,
  Carousel,
  Scrollbar,
  CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Timeline,
  TimelineItem,
  Link,
  Divider,
  Image,
  Calendar,
  Backtop,
  InfiniteScroll,
  PageHeader,
  CascaderPanel,
  Avatar,
  Drawer,
  Statistic,
  Popconfirm,
  Skeleton,
  SkeletonItem,
  Empty,
  Descriptions,
  DescriptionsItem,
  Result
}

export default {
  version: '0.0.2',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  CollapseTransition,
  Loading,
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  DatePickerV2,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  MessageBox,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Notification,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Spinner,
  Message,
  Badge,
  Card,
  Rate,
  Steps,
  Step,
  Carousel,
  Scrollbar,
  CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Timeline,
  TimelineItem,
  Link,
  Divider,
  Image,
  Calendar,
  Backtop,
  InfiniteScroll,
  PageHeader,
  CascaderPanel,
  Avatar,
  Drawer,
  Statistic,
  Popconfirm,
  Skeleton,
  SkeletonItem,
  Empty,
  Descriptions,
  DescriptionsItem,
  Result
};
