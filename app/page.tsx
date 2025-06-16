"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Wand2, Layers, PenTool, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Header Badge */}
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-emerald-100 text-emerald-800 border-emerald-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Acolyte Health
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Create Stunning Images with{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Imagify
              </span>
            </h1>
            <p className="text-xl text-gray-600 font-medium">Our advanced AI image generation platform</p>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">
              Transform your ideas into breathtaking visuals with Imagify, our state-of-the-art AI image generation
              platform. Create professional-quality images for any project with unparalleled detail and creativity.
            </p>
            <p className="text-base text-gray-600">
              From concept to masterpiece in seconds. Generate high-resolution images with perfect composition, stunning
              details, and artistic flair that brings your vision to life.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <ImageIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">High Resolution</h3>
              <p className="text-sm text-gray-600">Generate images up to 4K resolution with incredible detail</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Wand2 className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">Leveraging cutting-edge machine learning technology</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <PenTool className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Creative Control</h3>
              <p className="text-sm text-gray-600">Fine-tune every aspect of your generated images</p>
            </div>
          </div>

          {/* Image Gallery Preview */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                style={{
                  backgroundImage: `url('/pexel-${item}.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              size="lg"
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => router.push("/chat")}
            >
              Start Creating
              <Wand2 className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Advanced Features */}
          <div className="pt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Advanced Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                    <Layers className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Style Customization</h3>
                </div>
                <p className="text-gray-600">
                  Choose from dozens of artistic styles or create your own custom look. From photorealistic to abstract
                  art, the possibilities are endless.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                    <PenTool className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Precision Editing</h3>
                </div>
                <p className="text-gray-600">
                  Fine-tune your generated images with our intuitive editing tools. Adjust colors, composition, and
                  details with pixel-perfect precision.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Trusted partners powering our technology</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-xl font-bold text-gray-400">OpenAI</div>
              <div className="text-xl font-bold text-gray-400">Google</div>
              <div className="text-xl font-bold text-gray-400">Acolyte Health</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
