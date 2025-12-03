/* Automatically generated don't modify this file! */
/* eslint-disable perfectionist/sort-imports,perfectionist/sort-named-exports */

import AsyncValidator, { getValidationConfig, resetValidationConfig, setValidationConfig, zodRule } from 'async-validator-next'
import locale from 'element-ui/src/locale'
import CollapseTransition from 'element-ui/src/transitions/collapse-transition'
import Alert from '../packages/alert/index'
import Aside from '../packages/aside/index'
import Autocomplete from '../packages/autocomplete/index'
import Avatar from '../packages/avatar/index'
import Backtop from '../packages/backtop/index'
import Badge from '../packages/badge/index'
import Breadcrumb from '../packages/breadcrumb/index'
import BreadcrumbItem from '../packages/breadcrumb-item/index'
import Button from '../packages/button/index'
import ButtonGroup from '../packages/button-group/index'
import Calendar from '../packages/calendar/index'
import Card from '../packages/card/index'
import Carousel from '../packages/carousel/index'
import CarouselItem from '../packages/carousel-item/index'
import Cascader from '../packages/cascader/index'
import CascaderPanel from '../packages/cascader-panel/index'
import Checkbox from '../packages/checkbox/index'
import CheckboxButton from '../packages/checkbox-button/index'
import CheckboxGroup from '../packages/checkbox-group/index'
import Col from '../packages/col/index'
import Collapse from '../packages/collapse/index'
import CollapseItem from '../packages/collapse-item/index'
import ColorPicker from '../packages/color-picker/index'
import Container from '../packages/container/index'
import DatePicker from '../packages/date-picker/index'
import DatePickerV2 from '../packages/date-picker-v2/index'
import DateTable from '../packages/date-table/index'
import Descriptions from '../packages/descriptions/index'
import DescriptionsItem from '../packages/descriptions-item/index'
import Dialog from '../packages/dialog/index'
import Divider from '../packages/divider/index'
import Drawer from '../packages/drawer/index'
import Dropdown from '../packages/dropdown/index'
import DropdownItem from '../packages/dropdown-item/index'
import DropdownMenu from '../packages/dropdown-menu/index'
import Empty from '../packages/empty/index'
import Footer from '../packages/footer/index'
import Form from '../packages/form/index'
import FormItem from '../packages/form-item/index'
import Header from '../packages/header/index'
import Icon from '../packages/icon/index'
import Image from '../packages/image/index'
import ImageViewer from '../packages/image-viewer/index'
import InfiniteScroll from '../packages/infinite-scroll/index'
import Input from '../packages/input/index'
import InputNumber from '../packages/input-number/index'
import Link from '../packages/link/index'
import Loading from '../packages/loading/index'
import Main from '../packages/main/index'
import Menu from '../packages/menu/index'
import MenuItem from '../packages/menu-item/index'
import MenuItemGroup from '../packages/menu-item-group/index'
import Message from '../packages/message/index'
import MessageBox from '../packages/message-box/index'
import Notification from '../packages/notification/index'
import Option from '../packages/option/index'
import OptionGroup from '../packages/option-group/index'
import PageHeader from '../packages/page-header/index'
import Pagination from '../packages/pagination/index'
import Popconfirm from '../packages/popconfirm/index'
import Popover from '../packages/popover/index'
import Progress from '../packages/progress/index'
import Radio from '../packages/radio/index'
import RadioButton from '../packages/radio-button/index'
import RadioGroup from '../packages/radio-group/index'
import Rate from '../packages/rate/index'
import Result from '../packages/result/index'
import Row from '../packages/row/index'
import Scrollbar from '../packages/scrollbar/index'
import Select from '../packages/select/index'
import Skeleton from '../packages/skeleton/index'
import SkeletonItem from '../packages/skeleton-item/index'
import Slider from '../packages/slider/index'
import Spinner from '../packages/spinner/index'
import Statistic from '../packages/statistic/index'
import Step from '../packages/step/index'
import Steps from '../packages/steps/index'
import Submenu from '../packages/submenu/index'
import Switch from '../packages/switch/index'
import TabPane from '../packages/tab-pane/index'
import Table from '../packages/table/index'
import TableColumn from '../packages/table-column/index'
import Tabs from '../packages/tabs/index'
import Tag from '../packages/tag/index'
import TimePicker from '../packages/time-picker/index'
import TimeSelect from '../packages/time-select/index'
import Timeline from '../packages/timeline/index'
import TimelineItem from '../packages/timeline-item/index'
import Tooltip from '../packages/tooltip/index'
import Transfer from '../packages/transfer/index'
import Tree from '../packages/tree/index'
import Upload from '../packages/upload/index'
import UploadList from '../packages/upload-list/index'

const components = [
  Alert,
  Aside,
  Autocomplete,
  Avatar,
  Backtop,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  Carousel,
  CarouselItem,
  Cascader,
  CascaderPanel,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Col,
  Collapse,
  CollapseItem,
  ColorPicker,
  Container,
  DatePicker,
  DatePickerV2,
  DateTable,
  Descriptions,
  DescriptionsItem,
  Dialog,
  Divider,
  Drawer,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Empty,
  Footer,
  Form,
  FormItem,
  Header,
  Icon,
  Image,
  ImageViewer,
  Input,
  InputNumber,
  Link,
  Main,
  Menu,
  MenuItem,
  MenuItemGroup,
  Option,
  OptionGroup,
  PageHeader,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  RadioButton,
  RadioGroup,
  Rate,
  Result,
  Row,
  Scrollbar,
  Select,
  Skeleton,
  SkeletonItem,
  Slider,
  Spinner,
  Statistic,
  Step,
  Steps,
  Submenu,
  Switch,
  TabPane,
  Table,
  TableColumn,
  Tabs,
  Tag,
  TimePicker,
  TimeSelect,
  Timeline,
  TimelineItem,
  Tooltip,
  Transfer,
  Tree,
  Upload,
  UploadList,
  CollapseTransition,
]

function install(Vue, opts = {}) {
  locale.use(opts.locale)
  locale.i18n(opts.i18n)

  components.forEach((component) => {
    Vue.component(component.name, component)
  })

  Vue.use(InfiniteScroll)
  Vue.use(Loading.directive)

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000,
  }

  Vue.prototype.$loading = Loading.service
  Vue.prototype.$msgbox = MessageBox
  Vue.prototype.$alert = MessageBox.alert
  Vue.prototype.$confirm = MessageBox.confirm
  Vue.prototype.$prompt = MessageBox.prompt
  Vue.prototype.$notify = Notification
  Vue.prototype.$message = Message
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  CollapseTransition,
  Loading,
  Alert,
  Aside,
  Autocomplete,
  Avatar,
  Backtop,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  Carousel,
  CarouselItem,
  Cascader,
  CascaderPanel,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Col,
  Collapse,
  CollapseItem,
  ColorPicker,
  Container,
  DatePicker,
  DatePickerV2,
  DateTable,
  Descriptions,
  DescriptionsItem,
  Dialog,
  Divider,
  Drawer,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Empty,
  Footer,
  Form,
  FormItem,
  Header,
  Icon,
  Image,
  ImageViewer,
  InfiniteScroll,
  Input,
  InputNumber,
  Link,
  Main,
  Menu,
  MenuItem,
  MenuItemGroup,
  Message,
  MessageBox,
  Notification,
  Option,
  OptionGroup,
  PageHeader,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  RadioButton,
  RadioGroup,
  Rate,
  Result,
  Row,
  Scrollbar,
  Select,
  Skeleton,
  SkeletonItem,
  Slider,
  Spinner,
  Statistic,
  Step,
  Steps,
  Submenu,
  Switch,
  TabPane,
  Table,
  TableColumn,
  Tabs,
  Tag,
  TimePicker,
  TimeSelect,
  Timeline,
  TimelineItem,
  Tooltip,
  Transfer,
  Tree,
  Upload,
  UploadList,
  AsyncValidator,
  getValidationConfig,
  resetValidationConfig,
  setValidationConfig,
  zodRule,
}

export default {
  version: '0.2.0',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  CollapseTransition,
  Loading,
  Alert,
  Aside,
  Autocomplete,
  Avatar,
  Backtop,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  Carousel,
  CarouselItem,
  Cascader,
  CascaderPanel,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Col,
  Collapse,
  CollapseItem,
  ColorPicker,
  Container,
  DatePicker,
  DatePickerV2,
  DateTable,
  Descriptions,
  DescriptionsItem,
  Dialog,
  Divider,
  Drawer,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Empty,
  Footer,
  Form,
  FormItem,
  Header,
  Icon,
  Image,
  ImageViewer,
  InfiniteScroll,
  Input,
  InputNumber,
  Link,
  Main,
  Menu,
  MenuItem,
  MenuItemGroup,
  Message,
  MessageBox,
  Notification,
  Option,
  OptionGroup,
  PageHeader,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  RadioButton,
  RadioGroup,
  Rate,
  Result,
  Row,
  Scrollbar,
  Select,
  Skeleton,
  SkeletonItem,
  Slider,
  Spinner,
  Statistic,
  Step,
  Steps,
  Submenu,
  Switch,
  TabPane,
  Table,
  TableColumn,
  Tabs,
  Tag,
  TimePicker,
  TimeSelect,
  Timeline,
  TimelineItem,
  Tooltip,
  Transfer,
  Tree,
  Upload,
  UploadList,
  AsyncValidator,
  getValidationConfig,
  resetValidationConfig,
  setValidationConfig,
  zodRule,
}
