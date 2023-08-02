import { x64hash128 } from './hashing'

const longText =
  'Sociosqu libero in, gravida curae lobortis imperdiet. Elit odio consequat magna, molestie adipiscing phasellus, ' +
  'scelerisque urna integer id ad quam sit etiam. Etiam fringilla sodales, rhoncus imperdiet viverra ultricies ' +
  'congue. Porttitor etiam, nam a imperdiet. Leo himenaeos, mattis vitae senectus. Imperdiet convallis, congue sem ' +
  'tortor nulla. Lacus non conubia, hendrerit quisque, class lorem primis elit curabitur morbi felis. Hendrerit ' +
  'etiam tempus, accumsan urna nec torquent laoreet. Nisl tristique nibh, dictum ligula, litora ' +
  'risus vulputate porta volutpat aliquam. Aenean morbi convallis porttitor, nunc viverra egestas, tincidunt leo nam ' +
  'cubilia enim ligula rhoncus luctus. Porttitor fringilla suscipit, cras enim, aenean pulvinar morbi litora massa. ' +
  'Mollis magna facilisis orci, aptent justo inceptos, aliquet felis commodo turpis arcu donec class eros. Quisque ' +
  'fames per, ante ligula, curae pulvinar potenti aenean placerat. Facilisis semper fringilla scelerisque, fusce ' +
  'ante vulputate himenaeos malesuada. Ut platea, maecenas cursus ullamcorper. Nisl etiam nunc, diam tristique, ' +
  'dapibus metus malesuada scelerisque nam.\n' +
  'Augue sodales pulvinar, vehicula condimentum, suscipit neque netus non potenti libero. Scelerisque egestas justo, ' +
  'in tincidunt, tempor netus lacus habitasse cursus. Molestie habitant porta, hendrerit aptent, urna etiam class ' +
  'integer diam curabitur. Nec feugiat iaculis, lectus ac, mi sodales arcu purus nulla semper. Dictum eu nulla, ' +
  'tempor nullam, purus duis odio taciti id.\n' +
  'Eros lorem, nulla leo at. Ultricies viverra aliquet, sollicitudin condimentum, pulvinar elementum ante non aptent ' +
  'molestie. Varius suscipit vivamus, cras netus auctor aenean. Potenti diam augue cursus, ligula ipsum purus, mi ' +
  'vestibulum elementum auctor lorem enim tellus. Interdum amet, viverra dictumst odio dapibus.' +
  'Nam scelerisque litora himenaeos, maecenas sed enim, per bibendum erat gravida tincidunt porttitor egestas ' +
  'lacinia. Libero turpis rhoncus nulla, aliquam etiam ac, per eleifend nisi luctus vitae nunc. Etiam accumsan, ' +
  'senectus felis ad. Curabitur dui lobortis, mauris metus, est nec proin eleifend gravida magna laoreet. Porta ' +
  'vitae, himenaeos turpis integer varius. Vehicula fusce enim nostra, aliquam nisi nec ultricies aliquet.'

describe('Murmur3', () => {
  it('makes x64 128 bit hash', () => {
    const input = 'Hello, world, hi'
    const inputLessThanChunk = 'Hello, world, h'
    const inputGreaterThanChunk = 'Hello, world, hi!'
    const inputGreaterThan2Chunks = 'Hello, world, hi, Hello, world, hi'

    // Value: 'ňťŬŬůĬĠŷůŲŬŤĬĠŨũ'
    const nonAsciiInput = input
      .split('')
      .map((char) => String.fromCharCode(char.charCodeAt(0) + 256))
      .join('')

    const shortInput = 'hello'

    expect(x64hash128(input)).not.toBe(x64hash128(nonAsciiInput))

    expect(x64hash128(input)).toBe('9a66b4567d520770dc8eaf9a508ecf1b')
    expect(x64hash128(nonAsciiInput)).toBe('460892d2cab76edff07f62a97e106f6b')
    expect(x64hash128(shortInput)).toBe('cbd8a7b341bd9b025b1e906a48ae1d19')
    expect(x64hash128(longText)).toBe('211a6f425b82e115fb52ccdc51edb290')
    expect(x64hash128(inputLessThanChunk)).toBe('4552c6409e0a7bd3b0f9eb318bb35f05')
    expect(x64hash128(inputGreaterThanChunk)).toBe('dce3e02d43da4d2374e84e484c566492')
    expect(x64hash128(inputGreaterThan2Chunks)).toBe('d49c261c833b671870b471c42df4dbf0')
  })
})
