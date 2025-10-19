// @ts-nocheck
import Vue from 'vue/dist/vue.js'
import sinon from 'sinon'
import DateRangeSplit from 'packages/date-picker-v2/src/picker/date-range-split.vue'

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
})
