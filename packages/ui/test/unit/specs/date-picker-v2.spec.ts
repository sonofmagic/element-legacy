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
})
