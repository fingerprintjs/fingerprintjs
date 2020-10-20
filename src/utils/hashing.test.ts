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
    expect(x64hash128('Hello, world')).toBe('ebd28b45027ab97477416103e3fff7b8')
    expect(x64hash128(longText)).toBe('211a6f425b82e115fb52ccdc51edb290')
  })
})
