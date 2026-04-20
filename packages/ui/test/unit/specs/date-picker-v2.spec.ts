// @ts-nocheck
import Vue from 'vue'
import sinon from 'sinon'
import DateRangeSplit from 'packages/date-picker-v2/src/picker/date-range-split.vue'
import BaseDatePicker from 'packages/date-picker-v2/src/picker/base-date-picker'
import DateRangePanel from 'packages/date-picker-v2/src/panel/date-range.vue'
import DatePanel from 'packages/date-picker-v2/src/panel/date.vue'
import locale from 'main/locale'
import zhCN from 'main/locale/lang/zh-CN'

describe('DatePickerV2 range shortcuts', () => {
  function createInstance(propsData) {
    const Constructor = Vue.extend(DateRangeSplit)
    const vm = new Constructor({
      propsData: {
        type: 'daterange',
        ...propsData,
      },
    })

    vm.$mount()
    sinon.stub(vm, 'closePanel')

    return vm
  }

  it('applies shortcut range values and emits events', () => {
    const rangeStart = new Date(2020, 0, 5)
    const rangeEnd = new Date(2020, 0, 10)
    const onPick = sinon.spy()
    const pickerOptions = {
      shortcuts: [
        {
          text: 'shortcut',
          onClick(picker) {
            picker.$emit('pick', [new Date(rangeStart), new Date(rangeEnd)])
          },
        },
      ],
      onPick,
    }

    const vm = createInstance({
      pickerOptions,
    })

    const inputSpy = sinon.spy()
    const changeSpy = sinon.spy()
    vm.$on('input', inputSpy)
    vm.$on('change', changeSpy)

    const options = vm.buildPickerOptions('start')
    expect(options.shortcuts).to.have.length(1)

    const panelStub = { $emit: sinon.spy() }
    options.shortcuts[0].onClick(panelStub)

    expect(vm.startValue).to.be.instanceof(Date)
    expect(vm.endValue).to.be.instanceof(Date)
    expect(vm.startValue.getTime()).to.equal(rangeStart.getTime())
    expect(vm.endValue.getTime()).to.equal(rangeEnd.getTime())

    expect(inputSpy.calledOnce).to.be.true
    expect(changeSpy.calledOnce).to.be.true
    const payload = inputSpy.firstCall.args[0]
    expect(payload[0].getTime()).to.equal(rangeStart.getTime())
    expect(payload[1].getTime()).to.equal(rangeEnd.getTime())

    expect(onPick.calledOnce).to.be.true
    const pickArgs = onPick.firstCall.args[0]
    expect(pickArgs.minDate.getTime()).to.equal(rangeStart.getTime())
    expect(pickArgs.maxDate.getTime()).to.equal(rangeEnd.getTime())

    expect(vm.closePanel.calledOnce).to.be.true
    expect(vm.closePanel.firstCall.args[0]).to.equal('start')

    vm.$destroy()
  })

  it('formats shortcut output when value-format is set', () => {
    const rangeStart = new Date(2021, 5, 1)
    const rangeEnd = new Date(2021, 5, 15)
    const pickerOptions = {
      shortcuts: [
        {
          text: 'shortcut',
          onClick(picker) {
            picker.$emit('pick', [new Date(rangeStart), new Date(rangeEnd)])
          },
        },
      ],
    }

    const vm = createInstance({
      pickerOptions,
      valueFormat: 'yyyy-MM-dd',
    })

    const inputSpy = sinon.spy()
    vm.$on('input', inputSpy)

    const options = vm.buildPickerOptions('start')
    options.shortcuts[0].onClick({ $emit: sinon.spy() })

    expect(vm.startValue).to.equal('2021-06-01')
    expect(vm.endValue).to.equal('2021-06-15')

    expect(inputSpy.calledOnce).to.be.true
    expect(inputSpy.firstCall.args[0]).to.deep.equal(['2021-06-01', '2021-06-15'])

    vm.$destroy()
  })

  it('supports datetimerange shortcuts with default time', () => {
    const rangeStart = new Date(2022, 8, 10)
    const rangeEnd = new Date(2022, 8, 12)
    const pickerOptions = {
      shortcuts: [
        {
          text: 'shortcut',
          onClick(picker) {
            picker.$emit('pick', [new Date(rangeStart), new Date(rangeEnd)])
          },
        },
      ],
    }

    const vm = createInstance({
      type: 'datetimerange',
      defaultTime: ['08:00:00', '20:30:00'],
      pickerOptions,
    })

    const inputSpy = sinon.spy()
    vm.$on('input', inputSpy)

    const options = vm.buildPickerOptions('start')
    const endOptions = vm.buildPickerOptions('end')

    expect(vm.buildPickerProps('start').type).to.equal('datetime')
    expect(vm.buildPickerProps('end').type).to.equal('datetime')
    expect(options.shortcuts).to.have.length(1)
    expect(endOptions.shortcuts).to.have.length(1)

    options.shortcuts[0].onClick({ $emit: sinon.spy() })

    expect(vm.startValue).to.be.instanceof(Date)
    expect(vm.endValue).to.be.instanceof(Date)
    expect(vm.startValue.getHours()).to.equal(8)
    expect(vm.startValue.getMinutes()).to.equal(0)
    expect(vm.endValue.getHours()).to.equal(20)
    expect(vm.endValue.getMinutes()).to.equal(30)

    expect(inputSpy.calledOnce).to.be.true
    const payload = inputSpy.firstCall.args[0]
    expect(payload[0].getHours()).to.equal(8)
    expect(payload[1].getHours()).to.equal(20)

    expect(vm.closePanel.calledOnce).to.be.true
    expect(vm.closePanel.firstCall.args[0]).to.equal('start')

    vm.$destroy()
  })

  it('supports monthrange shortcuts', () => {
    const startMonth = new Date(2023, 4, 1)
    const endMonth = new Date(2023, 9, 1)
    const pickerOptions = {
      shortcuts: [
        {
          text: 'shortcut',
          onClick(picker) {
            picker.$emit('pick', [new Date(startMonth), new Date(endMonth)])
          },
        },
      ],
    }

    const vm = createInstance({
      type: 'monthrange',
      pickerOptions,
    })

    const inputSpy = sinon.spy()
    vm.$on('input', inputSpy)

    const options = vm.buildPickerOptions('start')
    const endOptions = vm.buildPickerOptions('end')

    expect(vm.buildPickerProps('start').type).to.equal('month')
    expect(vm.buildPickerProps('end').type).to.equal('month')
    expect(options.shortcuts).to.have.length(1)
    expect(endOptions.shortcuts).to.have.length(1)

    options.shortcuts[0].onClick({ $emit: sinon.spy() })

    expect(vm.startValue).to.be.instanceof(Date)
    expect(vm.startValue.getFullYear()).to.equal(2023)
    expect(vm.startValue.getMonth()).to.equal(4)
    expect(vm.endValue.getMonth()).to.equal(9)

    expect(inputSpy.calledOnce).to.be.true
    const payload = inputSpy.firstCall.args[0]
    expect(payload[0].getMonth()).to.equal(4)
    expect(payload[1].getMonth()).to.equal(9)

    expect(vm.closePanel.calledOnce).to.be.true
    expect(vm.closePanel.firstCall.args[0]).to.equal('start')

    vm.$destroy()
  })

  it('falls back to end value month when start is empty', async () => {
    const vm = createInstance({
      type: 'datetimerange',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      value: [null, '2023-09-01 00:45:00'],
    })

    await vm.$nextTick()

    const startProps = vm.buildPickerProps('start')
    expect(startProps.defaultValue).to.be.instanceof(Date)
    expect(startProps.defaultValue.getFullYear()).to.equal(2023)
    expect(startProps.defaultValue.getMonth()).to.equal(8)

    vm.$destroy()
  })

  it('supports yearrange shortcuts', () => {
    const startYear = new Date(2018, 0, 1)
    const endYear = new Date(2024, 0, 1)
    const pickerOptions = {
      shortcuts: [
        {
          text: 'shortcut',
          onClick(picker) {
            picker.$emit('pick', [new Date(startYear), new Date(endYear)])
          },
        },
      ],
    }

    const vm = createInstance({
      type: 'yearrange',
      pickerOptions,
    })

    const inputSpy = sinon.spy()
    vm.$on('input', inputSpy)

    const options = vm.buildPickerOptions('start')
    const endOptions = vm.buildPickerOptions('end')

    expect(vm.buildPickerProps('start').type).to.equal('year')
    expect(vm.buildPickerProps('end').type).to.equal('year')
    expect(options.shortcuts).to.have.length(1)
    expect(endOptions.shortcuts).to.have.length(1)

    options.shortcuts[0].onClick({ $emit: sinon.spy() })

    expect(vm.startValue).to.be.instanceof(Date)
    expect(vm.startValue.getFullYear()).to.equal(2018)
    expect(vm.endValue.getFullYear()).to.equal(2024)

    expect(inputSpy.calledOnce).to.be.true
    const payload = inputSpy.firstCall.args[0]
    expect(payload[0].getFullYear()).to.equal(2018)
    expect(payload[1].getFullYear()).to.equal(2024)

    expect(vm.closePanel.calledOnce).to.be.true
    expect(vm.closePanel.firstCall.args[0]).to.equal('start')

    vm.$destroy()
  })

  it('only focuses the end field when start value is present', () => {
    const vm = createInstance()
    const focusStub = sinon.stub(vm, 'focusEndInput')

    vm.startValue = new Date(2024, 0, 1)
    vm.handleStartChange()
    expect(focusStub.calledOnce).to.be.true

    focusStub.resetHistory()

    vm.startValue = null
    vm.handleStartChange()
    expect(focusStub.called).to.be.false

    vm.$destroy()
  })

  it('defaults to a single clear button that clears the entire range', async () => {
    const start = new Date(2024, 0, 1)
    const end = new Date(2024, 0, 2)
    const vm = createInstance({
      value: [start, end],
    })

    expect(vm.buildPickerProps('start').clearable).to.be.false
    expect(vm.buildPickerProps('end').clearable).to.be.true

    const inputSpy = sinon.spy()
    const changeSpy = sinon.spy()
    vm.$on('input', inputSpy)
    vm.$on('change', changeSpy)

    vm.handleEndInput(null)
    vm.handleEndChange()
    await vm.$nextTick()

    expect(vm.startValue).to.equal(null)
    expect(vm.endValue).to.equal(null)
    expect(inputSpy.callCount).to.be.greaterThan(0)
    expect(inputSpy.lastCall.args[0]).to.equal(null)
    expect(changeSpy.calledOnce).to.be.true
    expect(changeSpy.firstCall.args[0]).to.equal(null)

    vm.$destroy()
  })

  it('does not emit input or change when only one side is filled', () => {
    const vm = createInstance()
    const start = new Date(2025, 0, 1)
    vm.startValue = start
    vm.endValue = null

    const inputSpy = sinon.spy()
    const changeSpy = sinon.spy()
    vm.$on('input', inputSpy)
    vm.$on('change', changeSpy)

    vm.emitModel('change')

    expect(inputSpy.called).to.be.false
    expect(changeSpy.called).to.be.false

    vm.$destroy()
  })

  it('supports restoring two clear buttons via prop', () => {
    const vm = createInstance({
      singleClear: false,
    })

    expect(vm.buildPickerProps('start').clearable).to.be.true
    expect(vm.buildPickerProps('end').clearable).to.be.true

    vm.$destroy()
  })

  it('shows localized confirm text in single panel', async () => {
    locale.use(zhCN)
    const Constructor = Vue.extend(DatePanel)
    const vm = new Constructor().$mount()

    vm.showTime = true
    vm.visible = true
    await vm.$nextTick()

    const confirmButton = vm.$el.querySelector('.el-date-picker-v2__footer-confirm')
    expect(confirmButton).to.exist
    expect(confirmButton.textContent.trim()).to.equal(zhCN.el.datepicker.confirm)

    vm.$destroy()
  })
})

describe('DatePickerV2 public methods', () => {
  it('opens panel programmatically', async () => {
    const Constructor = Vue.extend(BaseDatePicker)
    const vm = new Constructor().$mount()

    sinon.stub(vm, 'showPicker')
    sinon.stub(vm, 'hidePicker')

    vm.open()
    await vm.$nextTick()

    expect(vm.pickerVisible).to.be.true
    expect(vm.showPicker.calledOnce).to.be.true

    vm.close()
    await vm.$nextTick()

    expect(vm.pickerVisible).to.be.false
    expect(vm.hidePicker.calledOnce).to.be.true

    vm.showPicker.restore()
    vm.hidePicker.restore()
    vm.$destroy()
  })

  it('opens split range picker from wrapper method', async () => {
    const Constructor = Vue.extend(DateRangeSplit)
    const vm = new Constructor({
      propsData: {
        type: 'datetimerange',
      },
    }).$mount()

    const startPicker = vm.$refs.startPicker
    sinon.stub(startPicker, 'open')

    vm.open()
    await vm.$nextTick()

    expect(startPicker.open.calledOnce).to.be.true
    expect(vm.activeField).to.equal('start')

    startPicker.open.restore()
    vm.$destroy()
  })

  it('closes split range picker from wrapper method', async () => {
    const Constructor = Vue.extend(DateRangeSplit)
    const vm = new Constructor({
      propsData: {
        type: 'datetimerange',
      },
    }).$mount()

    const startPicker = vm.$refs.startPicker
    sinon.stub(startPicker, 'handleClose')

    vm.close()
    await vm.$nextTick()

    expect(startPicker.handleClose.calledOnce).to.be.true
    expect(vm.activeField).to.equal(null)

    startPicker.handleClose.restore()
    vm.$destroy()
  })
})

describe('DatePickerV2 manual input normalization', () => {
  function createBasePicker(propsData) {
    const Constructor = Vue.extend(BaseDatePicker)
    const vm = new Constructor({
      propsData: {
        format: 'yyyy-MM-dd',
        ...propsData,
      },
    })
    vm.$mount()
    return vm
  }

  it('normalizes supported date separators into dashes', () => {
    const vm = createBasePicker({ type: 'date' })

    const parsedSlash = vm.parseString('2024/01/02')
    expect(vm.invalidUserInput).to.be.false
    expect(parsedSlash).to.be.instanceof(Date)
    expect(vm.formatToString(parsedSlash)).to.equal('2024-01-02')

    const parsedDot = vm.parseString('2024.03.04')
    expect(vm.invalidUserInput).to.be.false
    expect(parsedDot).to.be.instanceof(Date)
    expect(vm.formatToString(parsedDot)).to.equal('2024-03-04')

    vm.$destroy()
  })

  it('reverts to previous value when date separator is unsupported', async () => {
    const vm = createBasePicker({ type: 'date' })
    const current = new Date(2024, 0, 15)
    vm.value = current
    await vm.$nextTick()

    const emitSpy = sinon.spy()
    vm.$on('input', emitSpy)

    vm.userInput = '2024|02|01'
    vm.handleChange()

    expect(emitSpy.called).to.be.false
    expect(vm.invalidUserInput).to.be.false
    expect(vm.userInput).to.equal(vm.formatToString(current))

    vm.$destroy()
  })

  it('clears the field when unsupported date separator and no selection', () => {
    const vm = createBasePicker({ type: 'date' })

    vm.userInput = '2024|02|01'
    vm.handleChange()

    expect(vm.userInput).to.equal(null)
    expect(vm.invalidUserInput).to.be.false

    vm.$destroy()
  })

  it('reverts unsupported time separators back to the last value', async () => {
    const vm = createBasePicker({ type: 'time', format: 'HH:mm:ss' })
    const current = new Date(2024, 0, 1, 12, 30, 0)
    vm.value = current
    await vm.$nextTick()

    const emitSpy = sinon.spy()
    vm.$on('input', emitSpy)

    vm.userInput = '12-30-00'
    vm.handleChange()

    expect(emitSpy.called).to.be.false
    expect(vm.invalidUserInput).to.be.false
    expect(vm.userInput).to.equal(vm.formatToString(current))

    vm.$destroy()
  })
})

describe('DatePickerV2 split range start picker disabledDate', () => {
  function createInstance(propsData) {
    const Constructor = Vue.extend(DateRangeSplit)
    const vm = new Constructor({
      propsData: {
        type: 'daterange',
        ...propsData,
      },
    })

    vm.$mount()
    return vm
  }

  it('start picker does not disable dates after endValue', () => {
    const start = new Date(2026, 1, 24) // Feb 24
    const end = new Date(2026, 3, 10) // Apr 10
    const vm = createInstance({
      value: [start, end],
    })

    const options = vm.buildPickerOptions('start')
    // A date after endValue (e.g. Apr 14) should NOT be disabled for start picker
    const futureDate = new Date(2026, 3, 14) // Apr 14
    expect(options.disabledDate(futureDate)).to.be.false

    vm.$destroy()
  })

  it('end picker still disables dates before startValue', () => {
    const start = new Date(2026, 1, 24) // Feb 24
    const end = new Date(2026, 3, 10) // Apr 10
    const vm = createInstance({
      value: [start, end],
    })

    const options = vm.buildPickerOptions('end')
    // A date before startValue (e.g. Feb 1) should be disabled for end picker
    const pastDate = new Date(2026, 1, 1) // Feb 1
    expect(options.disabledDate(pastDate)).to.be.true

    // A date after startValue should not be disabled
    const validDate = new Date(2026, 2, 15) // Mar 15
    expect(options.disabledDate(validDate)).to.be.false

    vm.$destroy()
  })

  it('handleStartInput clears endValue when new start > end', () => {
    const start = new Date(2026, 1, 24)
    const end = new Date(2026, 3, 10)
    const vm = createInstance({
      value: [start, end],
    })

    const today = new Date(2026, 3, 14) // Apr 14, after endValue
    vm.handleStartInput(today)

    expect(vm.startValue).to.be.instanceof(Date)
    expect(vm.startValue.getTime()).to.equal(today.getTime())
    expect(vm.endValue).to.equal(null)

    vm.$destroy()
  })
})

describe('DatePickerV2 split range change event timing', () => {
  function createInstance(propsData) {
    const Constructor = Vue.extend(DateRangeSplit)
    const vm = new Constructor({
      propsData: {
        type: 'daterange',
        ...propsData,
      },
    })

    vm.$mount()
    return vm
  }

  it('does not emit change when only startValue is set', () => {
    const vm = createInstance()
    vm.startValue = new Date(2026, 3, 12)
    vm.endValue = null

    const changeSpy = sinon.spy()
    vm.$on('change', changeSpy)

    vm.handleStartChange()

    expect(changeSpy.called).to.be.false

    vm.$destroy()
  })

  it('emits change when both startValue and endValue are set', () => {
    const vm = createInstance()
    vm.startValue = new Date(2026, 3, 12)
    vm.endValue = new Date(2026, 3, 15)

    const changeSpy = sinon.spy()
    vm.$on('change', changeSpy)

    vm.handleStartChange()

    expect(changeSpy.calledOnce).to.be.true
    const payload = changeSpy.firstCall.args[0]
    expect(payload).to.be.an('array')
    expect(payload[0]).to.be.instanceof(Date)
    expect(payload[1]).to.be.instanceof(Date)

    vm.$destroy()
  })

  it('does not emit change from handleEndChange when startValue is empty', () => {
    const vm = createInstance()
    vm.startValue = null
    vm.endValue = new Date(2026, 3, 15)

    const changeSpy = sinon.spy()
    vm.$on('change', changeSpy)

    vm.handleEndChange()

    expect(changeSpy.called).to.be.false

    vm.$destroy()
  })

  it('emits change from handleEndChange when range is complete', () => {
    const vm = createInstance()
    vm.startValue = new Date(2026, 3, 12)
    vm.endValue = new Date(2026, 3, 15)

    const changeSpy = sinon.spy()
    vm.$on('change', changeSpy)

    vm.handleEndChange()

    expect(changeSpy.calledOnce).to.be.true

    vm.$destroy()
  })

  it('does not produce Invalid Date after clear then pick start only', async () => {
    // Simulate: had range → cleared → pick start only
    const start = new Date(2026, 3, 11)
    const end = new Date(2026, 3, 12)
    const vm = createInstance({
      value: [start, end],
    })

    const inputSpy = sinon.spy()
    const changeSpy = sinon.spy()
    vm.$on('input', inputSpy)
    vm.$on('change', changeSpy)

    // Step 1: clear via singleClear (end clear button)
    vm.handleEndInput(null)
    vm.handleEndChange()
    await vm.$nextTick()

    expect(vm.startValue).to.equal(null)
    expect(vm.endValue).to.equal(null)

    // Step 2: pick start date only
    const newStart = new Date(2026, 3, 12)
    vm.handleStartInput(newStart)
    vm.handleStartChange()
    await vm.$nextTick()

    expect(vm.startValue).to.be.instanceof(Date)
    expect(vm.endValue).to.equal(null)

    // Verify no Invalid Date in any emitted payload
    for (let i = 0; i < inputSpy.callCount; i++) {
      const payload = inputSpy.getCall(i).args[0]
      if (Array.isArray(payload)) {
        payload.forEach((val) => {
          if (val instanceof Date) {
            expect(Number.isNaN(val.getTime())).to.be.false
          }
        })
      }
    }

    // change should NOT have been called for the partial pick
    // (only for the clear which is a complete clear)
    const changeCallsAfterClear = changeSpy.callCount
    expect(changeCallsAfterClear).to.equal(1) // only the clear triggered change

    vm.$destroy()
  })

  it('emits change on partial pick when changeMode is partial', () => {
    const vm = createInstance({
      changeMode: 'partial',
    })
    vm.startValue = new Date(2026, 3, 12)
    vm.endValue = null

    const changeSpy = sinon.spy()
    vm.$on('change', changeSpy)

    vm.handleStartChange()

    expect(changeSpy.calledOnce).to.be.true
    const payload = changeSpy.firstCall.args[0]
    expect(payload).to.be.an('array')
    expect(payload[0]).to.be.instanceof(Date)
    expect(payload[1]).to.equal(null)

    vm.$destroy()
  })

  it('does not emit change on partial pick when changeMode is complete (default)', () => {
    const vm = createInstance()
    vm.startValue = new Date(2026, 3, 12)
    vm.endValue = null

    const changeSpy = sinon.spy()
    vm.$on('change', changeSpy)

    vm.handleStartChange()

    expect(changeSpy.called).to.be.false

    vm.$destroy()
  })
})

describe('DatePickerV2 date range panel helpers', () => {
  it('disables end time input when range is invalid', async () => {
    const Constructor = Vue.extend(DateRangePanel)
    const vm = new Constructor()
    vm.$mount()

    expect(vm.isEndTimeReadonly).to.be.true

    vm.showTime = true
    const min = new Date(2025, 9, 27, 1, 1, 1)
    vm.minDate = new Date(min)
    vm.maxDate = new Date(min)
    await vm.$nextTick()

    expect(vm.isEndTimeReadonly).to.be.false

    vm.maxDate = new Date(2025, 9, 26, 23, 59, 59)
    await vm.$nextTick()

    expect(vm.isEndTimeReadonly).to.be.true

    vm.maxDate = new Date(2025, 9, 27, 4, 0, 0)
    await vm.$nextTick()

    expect(vm.isEndTimeReadonly).to.be.false

    vm.$destroy()
  })

  it('keeps end-side context when only end value exists', async () => {
    const Constructor = Vue.extend(DateRangePanel)
    const vm = new Constructor()
    vm.$mount()

    const end = new Date(2023, 8, 1, 0, 45, 0)
    vm.value = [null, end]

    await vm.$nextTick()

    expect(vm.maxDate).to.be.instanceof(Date)
    expect(vm.maxDate.getTime()).to.equal(end.getTime())

    expect(vm.leftDate.getFullYear()).to.equal(2023)
    expect(vm.leftDate.getMonth()).to.equal(8)

    expect(vm.rightDate.getFullYear()).to.equal(2023)
    expect(vm.rightDate.getMonth()).to.equal(9)

    vm.resetView()
    expect(vm.maxDate).to.be.instanceof(Date)
    expect(vm.maxDate.getTime()).to.equal(end.getTime())

    vm.$destroy()
  })

  it('parses value-format strings for partial ranges', async () => {
    const Constructor = Vue.extend(DateRangePanel)
    const vm = new Constructor()
    vm.$mount()

    vm.format = 'yyyy-MM-dd HH:mm:ss'

    vm.value = [null, '2023-09-01 00:45:00']

    await vm.$nextTick()

    expect(vm.maxDate).to.be.instanceof(Date)
    expect(vm.leftDate.getFullYear()).to.equal(2023)
    expect(vm.leftDate.getMonth()).to.equal(8)
    expect(vm.rightDate.getFullYear()).to.equal(2023)
    expect(vm.rightDate.getMonth()).to.equal(9)

    vm.$destroy()
  })

  it('clamps end time spinner to start time when end value is empty', async () => {
    const Constructor = Vue.extend(DateRangePanel)
    const vm = new Constructor()
    vm.$mount()

    const start = new Date(2023, 8, 1, 8, 30, 0)
    vm.showTime = true
    vm.minDate = new Date(start)
    vm.maxDate = null

    vm.syncVisiblePanels()
    await vm.$nextTick()
    await vm.$nextTick()

    const maxTimePicker = vm.$refs.maxTimePicker
    expect(maxTimePicker).to.exist
    const [[rangeStart]] = maxTimePicker.selectableRange
    expect(rangeStart.getHours()).to.equal(8)
    expect(rangeStart.getMinutes()).to.equal(30)

    expect(maxTimePicker.defaultValue).to.be.instanceof(Date)
    expect(maxTimePicker.defaultValue.getHours()).to.equal(8)
    expect(maxTimePicker.defaultValue.getMinutes()).to.equal(30)

    expect(vm.rightDate.getFullYear()).to.equal(2023)
    expect(vm.rightDate.getMonth()).to.equal(8)

    vm.$destroy()
  })
})

describe('DatePickerV2 today button visibility', () => {
  it('hides today button when disabledDate includes today', async () => {
    const Constructor = Vue.extend(DatePanel)
    const vm = new Constructor().$mount()

    const today = new Date()
    vm.disabledDate = (date) => {
      return date.getFullYear() === today.getFullYear()
        && date.getMonth() === today.getMonth()
        && date.getDate() === today.getDate()
    }
    vm.visible = true
    await vm.$nextTick()

    expect(vm.isTodayDisabled).to.be.true
    const todayBtn = vm.$el.querySelector('.el-date-picker-v2__today-btn')
    expect(todayBtn).to.be.null

    vm.$destroy()
  })

  it('shows today button when disabledDate does not include today', async () => {
    const Constructor = Vue.extend(DatePanel)
    const vm = new Constructor().$mount()

    vm.disabledDate = (date) => date.getFullYear() < 2000 // only disable old dates
    vm.visible = true
    await vm.$nextTick()

    expect(vm.isTodayDisabled).to.be.false
    const todayBtn = vm.$el.querySelector('.el-date-picker-v2__today-btn')
    expect(todayBtn).to.exist

    vm.$destroy()
  })

  it('shows today button when no disabledDate is set', async () => {
    const Constructor = Vue.extend(DatePanel)
    const vm = new Constructor().$mount()

    vm.visible = true
    await vm.$nextTick()

    expect(vm.isTodayDisabled).to.be.false
    const todayBtn = vm.$el.querySelector('.el-date-picker-v2__today-btn')
    expect(todayBtn).to.exist

    vm.$destroy()
  })
})
