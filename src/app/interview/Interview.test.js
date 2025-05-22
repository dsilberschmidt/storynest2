import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Interview from './Interview'; // The component to test
import texts from '../../i18n/texts'; // For asserting against i18n strings

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn((param) => {
      if (param === 'edit') return null; // Default behavior
      return null;
    }),
  }),
}));

// Mock sessionStorage and localStorage
let mockSessionStore = {};
let mockLocalStore = {};

beforeEach(() => {
  mockSessionStore = {};
  mockLocalStore = { storynest_test: 'false' }; // Default test mode to false

  jest.spyOn(window.sessionStorage, 'getItem').mockImplementation(key => mockSessionStore[key]);
  jest.spyOn(window.sessionStorage, 'setItem').mockImplementation((key, value) => {
    mockSessionStore[key] = value.toString();
  });
  jest.spyOn(window.sessionStorage, 'removeItem').mockImplementation(key => {
    delete mockSessionStore[key];
  });
  jest.spyOn(window.localStorage, 'getItem').mockImplementation(key => mockLocalStore[key]);
  jest.spyOn(window.localStorage, 'setItem').mockImplementation((key, value) => {
    mockLocalStore[key] = value.toString();
  });
});

// Mock for SpeechRecognition
const mockSpeechRecognition = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  onresult: null,
  onerror: null,
  onend: null,
  lang: '',
  interimResults: false,
  maxAlternatives: 1,
}));

// Helper to trigger speech recognition events
const triggerSpeechEvent = (instance, eventName, value) => {
  if (instance && instance[eventName]) {
    instance[eventName](value);
  }
};

const defaultLang = 'en'; // Using 'en' for tests, can be changed

describe('Interview Component - Speech Input Functionality', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockSpeechRecognition.mockClear();
    mockSpeechRecognition.mockImplementation(() => ({
      start: jest.fn(),
      stop: jest.fn(),
      onresult: null,
      onerror: null,
      onend: null,
      lang: '',
      interimResults: false,
      maxAlternatives: 1,
    }));
    window.SpeechRecognition = mockSpeechRecognition;
    window.webkitSpeechRecognition = mockSpeechRecognition; // In case the component checks for both

    // Set default language for tests
    sessionStorage.setItem('storynest_language', defaultLang);
  });

  test('renders initial state correctly with microphone button', async () => {
    render(<Interview />);
    // Wait for questions to load and intro to pass (or handle intro button click)
    await waitFor(() => {
      // Click the "Next" button to move past the intro screen
      const nextButton = screen.getByRole('button', { name: texts[defaultLang].next });
      fireEvent.click(nextButton);
    });

    expect(screen.getByPlaceholderText(texts[defaultLang].writeHere)).toBeInTheDocument();
    const micButton = screen.getByRole('button', { name: new RegExp(texts[defaultLang].speakNow, "i") });
    expect(micButton).toBeInTheDocument();
    expect(micButton).toHaveTextContent(texts[defaultLang].speakNow);
  });

  test('starts speech recognition when mic button is clicked', async () => {
    render(<Interview />);
    await waitFor(() => {
      const nextButton = screen.getByRole('button', { name: texts[defaultLang].next });
      fireEvent.click(nextButton);
    });

    const micButton = screen.getByRole('button', { name: new RegExp(texts[defaultLang].speakNow, "i") });
    fireEvent.click(micButton);

    expect(mockSpeechRecognition).toHaveBeenCalledTimes(1);
    const recognitionInstance = mockSpeechRecognition.mock.results[0].value;
    expect(recognitionInstance.start).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: new RegExp(texts[defaultLang].listening, "i") })).toBeInTheDocument();
    });
  });

  test('updates text area with transcript on successful speech input and resets button', async () => {
    render(<Interview />);
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: texts[defaultLang].next }));
    });

    const micButton = screen.getByRole('button', { name: new RegExp(texts[defaultLang].speakNow, "i") });
    fireEvent.click(micButton);
    
    const recognitionInstance = mockSpeechRecognition.mock.results[0].value;
    
    // Simulate successful speech recognition
    const mockTranscript = 'Hello world';
    triggerSpeechEvent(recognitionInstance, 'onresult', {
      results: [[{ transcript: mockTranscript }]],
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText(texts[defaultLang].writeHere)).toHaveValue(mockTranscript);
    });

    // Simulate end of recognition
    triggerSpeechEvent(recognitionInstance, 'onend', {});

    await waitFor(() => {
      expect(screen.getByRole('button', { name: new RegExp(texts[defaultLang].speakNow, "i") })).toBeInTheDocument();
    });
  });

  // Test for 'no-speech' error
  test('handles "no-speech" error and displays message', async () => {
    render(<Interview />);
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: texts[defaultLang].next }));
    });

    const micButton = screen.getByRole('button', { name: new RegExp(texts[defaultLang].speakNow, "i") });
    fireEvent.click(micButton);

    const recognitionInstance = mockSpeechRecognition.mock.results[0].value;
    triggerSpeechEvent(recognitionInstance, 'onerror', { error: 'no-speech' });
    triggerSpeechEvent(recognitionInstance, 'onend', {}); // onend usually follows onerror

    await waitFor(() => {
      expect(screen.getByText(texts[defaultLang].speechErrorNoSpeech)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: new RegExp(texts[defaultLang].tryAgain, "i") })).toBeInTheDocument();
    });
  });

  // Test for 'not-allowed' (permission denied) error
  test('handles "not-allowed" error and displays message', async () => {
    render(<Interview />);
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: texts[defaultLang].next }));
    });

    const micButton = screen.getByRole('button', { name: new RegExp(texts[defaultLang].speakNow, "i") });
    fireEvent.click(micButton);

    const recognitionInstance = mockSpeechRecognition.mock.results[0].value;
    triggerSpeechEvent(recognitionInstance, 'onerror', { error: 'not-allowed' });
    triggerSpeechEvent(recognitionInstance, 'onend', {});

    await waitFor(() => {
      expect(screen.getByText(texts[defaultLang].micPermissionDenied)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: new RegExp(texts[defaultLang].tryAgain, "i") })).toBeInTheDocument();
    });
  });
  
  // Test for 'audio-capture' error
  test('handles "audio-capture" error and displays message', async () => {
    render(<Interview />);
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: texts[defaultLang].next }));
    });

    const micButton = screen.getByRole('button', { name: new RegExp(texts[defaultLang].speakNow, "i") });
    fireEvent.click(micButton);

    const recognitionInstance = mockSpeechRecognition.mock.results[0].value;
    triggerSpeechEvent(recognitionInstance, 'onerror', { error: 'audio-capture' });
    triggerSpeechEvent(recognitionInstance, 'onend', {});

    await waitFor(() => {
      expect(screen.getByText(texts[defaultLang].speechErrorAudioCapture)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: new RegExp(texts[defaultLang].tryAgain, "i") })).toBeInTheDocument();
    });
  });

  // Test for 'network' error
  test('handles "network" error and displays message', async () => {
    render(<Interview />);
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: texts[defaultLang].next }));
    });

    const micButton = screen.getByRole('button', { name: new RegExp(texts[defaultLang].speakNow, "i") });
    fireEvent.click(micButton);

    const recognitionInstance = mockSpeechRecognition.mock.results[0].value;
    triggerSpeechEvent(recognitionInstance, 'onerror', { error: 'network' });
    triggerSpeechEvent(recognitionInstance, 'onend', {});

    await waitFor(() => {
      expect(screen.getByText(texts[defaultLang].speechErrorNetwork)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: new RegExp(texts[defaultLang].tryAgain, "i") })).toBeInTheDocument();
    });
  });
  
  // Test for unknown error
  test('handles unknown speech error and displays message', async () => {
    render(<Interview />);
     await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: texts[defaultLang].next }));
    });

    const micButton = screen.getByRole('button', { name: new RegExp(texts[defaultLang].speakNow, "i") });
    fireEvent.click(micButton);

    const recognitionInstance = mockSpeechRecognition.mock.results[0].value;
    const unknownError = 'some-other-error';
    triggerSpeechEvent(recognitionInstance, 'onerror', { error: unknownError });
    triggerSpeechEvent(recognitionInstance, 'onend', {});
    
    await waitFor(() => {
        const expectedMessage = (texts[defaultLang].speechErrorUnknown || 'An unknown speech error occurred') + `: ${unknownError}`;
        // Using a function to match partial text for the error code part
        expect(screen.getByText((content, element) => content.startsWith(texts[defaultLang].speechErrorUnknown) && content.endsWith(unknownError))).toBeInTheDocument();
        expect(screen.getByRole('button', { name: new RegExp(texts[defaultLang].tryAgain, "i") })).toBeInTheDocument();
    });
  });

  test('handles case where SpeechRecognition API is not supported', async () => {
    window.SpeechRecognition = undefined;
    window.webkitSpeechRecognition = undefined;

    render(<Interview />);
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: texts[defaultLang].next }));
    });
    
    const micButton = screen.getByRole('button', { name: new RegExp(texts[defaultLang].speakNow, "i") });
    fireEvent.click(micButton); // Attempt to click

    await waitFor(() => {
      expect(screen.getByText(texts[defaultLang].speechRecognitionNotSupported)).toBeInTheDocument();
    });
    // Depending on implementation, the button might become disabled or its text might change.
    // The current implementation shows an error message and the button text becomes "Try Again".
    // Let's verify the button text is "Try Again" which indicates an error state.
    expect(screen.getByRole('button', { name: new RegExp(texts[defaultLang].tryAgain, "i") })).toBeInTheDocument();
  });

  test('stops listening when mic button is clicked while listening', async () => {
    render(<Interview />);
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: texts[defaultLang].next }));
    });

    const micButton = screen.getByRole('button', { name: new RegExp(texts[defaultLang].speakNow, "i") });
    fireEvent.click(micButton); // Start listening

    const recognitionInstance = mockSpeechRecognition.mock.results[0].value;

    await waitFor(() => {
      expect(screen.getByRole('button', { name: new RegExp(texts[defaultLang].listening, "i") })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: new RegExp(texts[defaultLang].listening, "i") })); // Stop listening

    expect(recognitionInstance.stop).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      // onend should be called by the component's handleMicClick when explicitly stopping
      // or by the speech recognition service itself.
      // If stop() itself triggers onend in the mock, this is fine.
      // Otherwise, we might need to manually call triggerSpeechEvent(recognitionInstance, 'onend', {});
      // For now, assuming stop() implies onend or component handles it.
      expect(screen.getByRole('button', { name: new RegExp(texts[defaultLang].speakNow, "i") })).toBeInTheDocument();
    });
  });

});
