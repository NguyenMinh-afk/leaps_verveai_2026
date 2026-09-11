// ============================================
// VERVE AI - About Page
// ============================================

'use client'

import * as React from 'react'
import Link from 'next/link'
import { PublicLayout } from '@/components/public'
import { Card, Button } from '@/components/ui'
import {
  Info,
  Target,
  Eye,
  Rocket,
  Users,
  Brain,
  ChartLine,
  ShieldCheck,
  GraduationCap,
  Lightbulb,
} from '@phosphor-icons/react'

/**
 * Value Card Component
 */
interface ValueCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => (
  <Card variant="default" padding="lg" className="text-center">
    <div className="inline-flex items-center justify-center rounded-full bg-verve-100 p-4 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>
  </Card>
)

/**
 * Stat Card Component
 */
interface StatCardProps {
  number: string
  label: string
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-verve-600 dark:text-verve-400">{number}</div>
    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{label}</div>
  </div>
)

/**
 * About Page
 */
export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-verve-50 to-white dark:from-slate-900 dark:to-slate-950 py-16 lg:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-verve-200/30 dark:bg-verve-900/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-200/30 dark:bg-amber-900/20 blur-3xl" />
        </div>
        <div className="container-verve relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-verve-100 p-3 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 mb-6">
              <Info size={32} />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
              Về VERVE AI
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              VERVE AI là nền tảng chẩn đoán nguyên nhân gốc của lỗ hổng kiến thức, gom nhóm học sinh theo
              nguyên nhân chung để giáo viên can thiệp đúng chỗ thay vì chỉ nhìn điểm số.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Bắt đầu miễn phí
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Liên hệ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="container-verve">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <StatCard number="50,000+" label="Học sinh" />
            <StatCard number="3,000+" label="Giáo viên" />
            <StatCard number="500+" label="Trường học" />
            <StatCard number="95%" label="Hài lòng" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24">
        <div className="container-verve">
          <div className="grid gap-12 lg:grid-cols-2">
            <Card variant="default" padding="lg" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Target size={48} className="text-verve-200 dark:text-verve-800" />
              </div>
              <div className="relative">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sứ mệnh</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                  Chúng tôi tin rằng mỗi học sinh đều có tiềm năng riêng biệt. VERVE AI ra đời để giúp giáo viên
                  nhận ra và phát huy tiềm năng đó thông qua phân tích dữ liệu học tập cá nhân hóa,
                  thay vì dạy theo một khuôn mẫu chung.
                </p>
                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                  Mục tiêu của chúng tôi là mang đến công cụ hỗ trợ giáo viên trong việc:
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <svg className="h-5 w-5 text-verve-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Hiểu rõ điểm mạnh và điểm cần cải thiện của từng học sinh
                  </li>
                  <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <svg className="h-5 w-5 text-verve-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Can thiệp kịp thời khi phát hiện vấn đề học tập
                  </li>
                  <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <svg className="h-5 w-5 text-verve-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Tiết kiệm thời gian trong việc tạo đề kiểm tra và bài tập
                  </li>
                </ul>
              </div>
            </Card>

            <Card variant="default" padding="lg" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Eye size={48} className="text-verve-200 dark:text-verve-800" />
              </div>
              <div className="relative">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tầm nhìn</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                  Trở thành nền tảng giáo dục thông minh được tin dùng nhất tại Việt Nam,
                  góp phần nâng cao chất lượng giáo dục thông qua ứng dụng công nghệ AI
                  một cách có trách nhiệm và hiệu quả.
                </p>
                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                  Chúng tôi hướng đến một tương lai nơi:
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <svg className="h-5 w-5 text-verve-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mỗi học sinh được học theo tốc độ và phong cách phù hợp
                  </li>
                  <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <svg className="h-5 w-5 text-verve-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Giáo viên có thời gian để tập trung vào chất lượng giảng dạy
                  </li>
                  <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <svg className="h-5 w-5 text-verve-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Dữ liệu học tập được bảo mật và sử dụng vì lợi ích học sinh
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container-verve">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Giá trị cốt lõi</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi quyết định của VERVE AI
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ValueCard
              icon={<GraduationCap size={28} />}
              title="Học sinh là trung tâm"
              description="Mọi tính năng đều hướng đến lợi ích và sự phát triển của học sinh."
            />
            <ValueCard
              icon={<Brain size={28} />}
              title="AI có trách nhiệm"
              description="Sử dụng AI như công cụ hỗ trợ, không thay thế vai trò của giáo viên."
            />
            <ValueCard
              icon={<ShieldCheck size={28} />}
              title="Bảo mật tuyệt đối"
              description="Dữ liệu học sinh được bảo vệ theo tiêu chuẩn cao nhất."
            />
            <ValueCard
              icon={<Lightbulb size={28} />}
              title="Đổi mới liên tục"
              description="Không ngừng cải tiến sản phẩm dựa trên phản hồi của người dùng."
            />
          </div>
        </div>
      </section>

      {/* How it Started */}
      <section className="py-16 lg:py-24">
        <div className="container-verve">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-verve-100 px-3 py-1 text-sm font-medium text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 mb-4">
                <Rocket size={16} />
                Khởi nguồn
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Từ ý tưởng đến hiện thực
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                VERVE AI được thành lập vào năm 2023 bởi một nhóm giáo viên, chuyên gia AI và kỹ sư phần mềm
                với chung một niềm tin: công nghệ có thể giúp giáo dục tốt hơn, nhưng phải đặt con người lên đầu.
              </p>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                Sau nhiều năm giảng dạy và quan sát thực tế, chúng tôi nhận ra rằng giáo viên cần một công cụ
                không chỉ tạo bài tập, mà còn giúp hiểu rõ từng học sinh để can thiệp đúng lúc, đúng cách.
              </p>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                VERVE AI ra đời từ thực tiễn đó - kết hợp sức mạnh của AI với sự thấu hiểu của người thầy.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-verve-100 to-verve-200 dark:from-verve-900/50 dark:to-verve-800/50 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-verve-600 dark:text-verve-400">2023</div>
                  <div className="mt-2 text-lg text-verve-700 dark:text-verve-300">Năm thành lập</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-verve-600 dark:bg-verve-800">
        <div className="container-verve text-center">
          <h2 className="text-3xl font-bold text-white">
            Sẵn sàng trải nghiệm VERVE AI?
          </h2>
          <p className="mt-4 text-verve-100 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn giáo viên và học sinh đang sử dụng VERVE AI để cải thiện chất lượng giáo dục.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button variant="secondary" size="lg" className="bg-white text-verve-700 hover:bg-verve-50">
                Đăng ký miễn phí
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Liên hệ tư vấn
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
