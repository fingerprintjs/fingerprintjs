import { addStyleString } from './dom'

describe('DOM utilities', () => {
  it('adds style string', () => {
    const element = document.createElement('div')
    addStyleString(element.style, '; width : 450px ; ; display: block  !important; text-align :center')
    expect((element.getAttribute('style') || '').split(/; */).sort()).toEqual([
      '',
      jasmine.stringMatching(/^display: block ! ?important$/),
      'text-align: center',
      'width: 450px',
    ])
  })
})
