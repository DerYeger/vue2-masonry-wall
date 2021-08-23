/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import MasonryWall from '@/entry'
import Vue from 'vue'

let observeMock = jest.fn()
let unobserveMock = jest.fn()

function mockResizeObserver() {
  observeMock = jest.fn()
  unobserveMock = jest.fn()
  const resizeObserverMock = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: observeMock,
    unobserve: unobserveMock,
  }))
  window.ResizeObserver = window.ResizeObserver || resizeObserverMock
}

type MasonryWallType = InstanceType<typeof MasonryWall>

const TestComponent = Vue.extend({
  template: '<masonry-wall :items="[1, 2, 3]" />',
})

describe('MasonryWall', () => {
  beforeAll(() => {
    console.warn = function (message) {
      throw message
    }
  })
  beforeEach(() => {
    mockResizeObserver()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('can be installed', async () => {
    Vue.use(MasonryWall)
    const wrapper = mount(TestComponent)
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>('.masonry-wall')
    expect(wall.element).toBeDefined()
    const items = wrapper.findAll('.masonry-item')
    expect(items.length).toEqual(3)
  })
  it('creates SSR columns', async () => {
    const wrapper = mount(MasonryWall, {
      propsData: {
        items: [1, 2],
        ssrColumns: 1,
      },
    })
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>('.masonry-wall')
    expect(wall.element).toBeDefined()
    const columns = wrapper.findAll('.masonry-column')
    expect(columns.length).toEqual(1)
    const items = wrapper.findAll('.masonry-item')
    expect(items.length).toEqual(2)
  })
  it('reacts to item changes', async () => {
    const wrapper = mount(MasonryWall, {
      propsData: {
        items: [1, 2],
      },
    })
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>('.masonry-wall')
    expect(wall.element).toBeDefined()
    const columns = wrapper.findAll('.masonry-column')
    expect(columns.length).toEqual(1)
    expect(wrapper.findAll('.masonry-item').length).toEqual(2)
    wrapper.setProps({
      items: [1, 2, 3],
    })
    await flushPromises()
    expect(wrapper.findAll('.masonry-item').length).toEqual(3)
    wrapper.setProps({
      items: [1],
    })
    await flushPromises()
    expect(wrapper.findAll('.masonry-item').length).toEqual(1)
  })
  it('unobserves the ResizeObserver', async () => {
    expect(observeMock.mock.calls.length).toEqual(0)
    const wrapper = mount(MasonryWall, {
      propsData: {
        items: [1, 2],
      },
    })
    await flushPromises()
    expect(observeMock.mock.calls.length).toEqual(1)
    expect(unobserveMock.mock.calls.length).toEqual(0)
    wrapper.destroy()
    expect(unobserveMock.mock.calls.length).toEqual(1)
  })
  it('reacts to column-width prop changes', async () => {
    const wrapper = mount<MasonryWallType>(MasonryWall, {
      propsData: {
        items: [1, 2],
      },
    })
    const redrawSpy = jest.spyOn(wrapper.vm, 'redraw')
    const columnCountSpy = jest.spyOn(wrapper.vm, 'columnCount')
    await flushPromises()
    expect(redrawSpy.mock.calls.length).toEqual(0)
    columnCountSpy.mockReturnValueOnce(2).mockReturnValueOnce(3)
    wrapper.setProps({
      columnWidth: 300,
    })
    await flushPromises()
    expect(redrawSpy.mock.calls.length).toEqual(1)
  })
  it('reacts to padding prop changes', async () => {
    const wrapper = mount<MasonryWallType>(MasonryWall, {
      propsData: {
        items: [1, 2],
      },
    })
    const redrawSpy = jest.spyOn(wrapper.vm, 'redraw')
    const columnCountSpy = jest.spyOn(wrapper.vm, 'columnCount')
    await flushPromises()
    expect(redrawSpy.mock.calls.length).toEqual(0)
    columnCountSpy.mockReturnValueOnce(2).mockReturnValueOnce(3)
    wrapper.setProps({
      padding: 42,
    })
    await flushPromises()
    expect(redrawSpy.mock.calls.length).toEqual(1)
  })
  it('reacts to rtl prop changes', async () => {
    const wrapper = mount<MasonryWallType>(MasonryWall, {
      propsData: {
        items: [1, 2],
      },
    })
    const redrawSpy = jest.spyOn(wrapper.vm, 'redraw')
    await flushPromises()
    expect(redrawSpy.mock.calls.length).toEqual(0)
    wrapper.setProps({
      rtl: true,
    })
    await flushPromises()
    expect(redrawSpy.mock.calls.length).toEqual(1)
  })
})
