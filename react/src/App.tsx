import { Toaster } from 'react-hot-toast'
import ImageGenerator from './components/ImageGenerator'
import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ImageGenerator />
      </main>
    </div>
  )
}

export default App 