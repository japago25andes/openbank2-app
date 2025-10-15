import { TestBed, inject } from '@angular/core/testing';
import { CapturaInformacionService } from './captura-informacion.service';

describe('Service: CapturaInformacion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CapturaInformacionService]
    });
  });

  it('should ...', inject([CapturaInformacionService], (service: CapturaInformacionService) => {
    expect(service).toBeTruthy();
  }));
});
