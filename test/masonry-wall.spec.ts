/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Vue from 'vue'
import MasonryWall from '@/entry'

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

const TestComponent = {
  template: `
    <masonry-wall :items="items" :ssrColumns="ssrColumns" :width="1">
      <template #default="{ item }">
        <div style="height: 100px">
          {{ item }}
        </div>
      </template>
    </masonry-wall>`,
  props: {
    items: {
      type: Array,
      default: () => [1, 2, 3],
    },
    ssrColumns: {
      type: Number,
      default: undefined,
    },
  },
}

describe('MasonryWall', () => {
  beforeAll(() => {
    console.warn = function (message) {
      throw message
    }
    Vue.use(MasonryWall)
  })
  beforeEach(() => {
    mockResizeObserver()
    observeMock.mockReset()
    unobserveMock.mockReset()
  })
  it('can be installed', async () => {
    const wrapper = mount(TestComponent)
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>('.masonry-wall')
    expect(wall.element).toBeDefined()
    const items = wrapper.findAll('.masonry-item')
    expect(items.length).toEqual(3)
  })
  it('creates SSR columns', async () => {
    const wrapper = mount(TestComponent, {
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
    const wrapper = mount(TestComponent, {
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
    const wrapper = mount(TestComponent, {
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
})
