// ============================================
// VERVE AI - Public Landing Page
// ============================================

'use client'

import Link from 'next/link'
import {
  PublicHeader,
  PublicFooter,
  features,
} from '@/components/public'
import { Button } from '@/components/ui'
import { MasteryRingIndicator } from '@/components/ui/mastery-indicator'
import {
  ArrowRight,
  CheckCircle,
  Brain,
  ChartLine,
  Lightbulb,
  Users,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  Target,
  TrendUp,
  Play,
} from '@phosphor-icons/react'

/**
 * Landing Page
 * Public marketing page for VERVE AI educational platform
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-verve-100/50 dark:bg-verve-900/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-100/50 dark:bg-amber-900/20 blur-3xl" />
          </div>

          <div className="container-verve relative">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Hero Content */}
              <div className="text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-verve-200 bg-verve-50 px-4 py-1.5 text-sm font-medium text-verve-600 dark:border-verve-800 dark:bg-verve-900/30 dark:text-verve-300 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-verve-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-verve-500" />
                  </span>
                  Nền tảng giáo dục thông minh
                </div>

                {/* Headline */}
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-tight">
                  Hiểu học sinh.
                  <br />
                  <span className="text-verve-500 dark:text-verve-400">
                    Cá nhân hóa tiến bộ.
                  </span>
                  <br />
                  <span className="whitespace-nowrap">Trao quyền giáo viên.</span>
                </h1>

                {/* Subheadline */}
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  VERVE AI chẩn đoán nguyên nhân gốc của lỗ hổng kiến thức thay vì chỉ đo điểm số,
                  gom nhóm học sinh để giáo viên can thiệp đúng chỗ.
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/register">
                    <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
                      Bắt đầu miễn phí
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button variant="outline" size="lg" leftIcon={<Play size={18} weight="fill" />}>
                      Xem cách hoạt động
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success-600" weight="fill" />
                    <span>Dùng thử miễn phí</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success-600" weight="fill" />
                    <span>Không cần thẻ tín dụng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-success-600" weight="fill" />
                    <span>Thiết lập trong 5 phút</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual - Mastery Dashboard Preview */}
              <div className="relative">
                <div className="relative rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50 overflow-hidden">
                  {/* Browser header */}
                  <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-slate-500">VERVE AI - Dashboard</span>
                    </div>
                  </div>

                  {/* Dashboard preview */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Tổng quan lớp học - Toán 6A
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        32 học sinh • Cập nhật: 2 giờ trước
                      </p>
                    </div>

                    {/* Mastery overview */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800/50">
                        <div className="text-2xl font-bold text-success-600">18</div>
                        <div className="text-xs text-slate-500">Thành thạo</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800/50">
                        <div className="text-2xl font-bold text-amber-600">10</div>
                        <div className="text-xs text-slate-500">Đang học</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800/50">
                        <div className="text-2xl font-bold text-error-600">4</div>
                        <div className="text-xs text-slate-500">Cần hỗ trợ</div>
                      </div>
                    </div>

                    {/* Student mastery indicators */}
                    <div className="mt-4 flex items-end justify-center gap-3">
                      <MasteryRingIndicator pKnown={0.85} size="lg" showLabel={false} />
                      <MasteryRingIndicator pKnown={0.72} size="md" showLabel={false} />
                      <MasteryRingIndicator pKnown={0.65} size="md" showLabel={false} />
                      <MasteryRingIndicator pKnown={0.45} size="md" showLabel={false} />
                      <MasteryRingIndicator pKnown={0.28} size="md" showLabel={false} />
                    </div>

                    {/* AI generation badge */}
                    <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-900/50 dark:bg-purple-900/20">
                      <div className="flex items-center gap-2">
                        <Brain size={16} className="text-purple-600" weight="duotone" />
                        <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                          3 nhóm can thiệp mới được xác định
                        </span>
                        <span className="ml-auto text-xs text-purple-500">Cần xem xét</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-100 text-success-600 dark:bg-success-900/30">
                      <TrendUp size={16} weight="bold" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-white">+12%</p>
                      <p className="text-[10px] text-slate-500">Tiến bộ tuần này</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30">
                      <Target size={16} weight="bold" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-white">3</p>
                      <p className="text-[10px] text-slate-500">Cần can thiệp</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="container-verve">
            {/* Section header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Nền tảng giáo dục thông minh
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                VERVE AI cung cấp bộ công cụ toàn diện giúp giáo viên và học sinh
                làm việc hiệu quả hơn với sự hỗ trợ của AI và dữ liệu học tập.
              </p>
            </div>

            {/* Features grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-verve-100 text-verve-500 dark:bg-verve-900/30 dark:text-verve-400">
                    <feature.icon size={24} weight="duotone" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {feature.titleVi}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {feature.descriptionVi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 lg:py-24">
          <div className="container-verve">
            {/* Section header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Cách VERVE AI hoạt động
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Quy trình học tập thông minh được xây dựng trên nền tảng khoa học giáo dục
                và công nghệ AI tiên tiến.
              </p>
            </div>

            {/* Workflow steps */}
            <div className="grid gap-8 lg:grid-cols-5">
              {/* Step 1 */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <BookOpen size={28} weight="duotone" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Hoạt động học tập
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Học sinh làm bài kiểm tra, bài tập hoặc đánh giá trên nền tảng
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center justify-center">
                <ArrowRight size={24} className="text-slate-300 dark:text-slate-600" />
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <ChartLine size={28} weight="duotone" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Thu thập bằng chứng
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Hệ thống ghi nhận phản hồi, thời gian và ngữ cảnh học tập
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center justify-center">
                <ArrowRight size={24} className="text-slate-300 dark:text-slate-600" />
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <Brain size={28} weight="duotone" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Ước lượng độ thành thạo
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Mô hình Bayesian đánh giá mức độ hiểu của từng học sinh
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:grid-cols-4">
              {/* Step 4 */}
              <div className="text-center lg:col-start-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <Lightbulb size={28} weight="duotone" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Gợi ý cá nhân
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Đề xuất nội dung phù hợp với nhu cầu từng học sinh
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center justify-center">
                <ArrowRight size={24} className="text-slate-300 dark:text-slate-600" />
              </div>

              {/* Step 5 */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  <Users size={28} weight="duotone" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Can thiệp kịp thời
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Giáo viên nhận thông báo và gợi ý can thiệp cho học sinh cần hỗ trợ
                </p>
              </div>
            </div>

            {/* Result */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-success-200 bg-success-50 px-4 py-2 text-sm font-medium text-success-700 dark:border-success-900/50 dark:bg-success-900/20 dark:text-success-300">
                <TrendUp size={18} weight="bold" />
                Cải thiện kết quả học tập
              </div>
            </div>
          </div>
        </section>

        {/* For Teachers Section */}
        <section id="for-teachers" className="py-16 lg:py-24 bg-verve-50 dark:bg-verve-900/10">
          <div className="container-verve">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-verve-200 bg-verve-100 px-3 py-1 text-sm font-medium text-verve-600 dark:border-verve-800 dark:bg-verve-900/30 dark:text-verve-300 mb-4">
                  <GraduationCap size={16} weight="duotone" />
                  Dành cho Giáo viên
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl whitespace-nowrap">
                  Biết nguyên nhân, không chỉ biết điểm số
                </h2>

                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  Thay vì nhìn điểm số chung chung, VERVE AI giúp giáo viên gom học sinh
                  theo nguyên nhân gốc chung — để can thiệp đúng chỗ, đúng cách.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    'Gom nhóm học sinh theo nguyên nhân gốc thay vì theo điểm số',
                    'Xem chuỗi bằng chứng dẫn tới mỗi kết luận chẩn đoán',
                    'Bác bỏ hoặc điều chỉnh kết luận của hệ thống khi cần',
                    'Nhận danh sách nhóm can thiệp kèm thứ tự ưu tiên',
                    'Xác định lỗ hổng chung của cả lớp để can thiệp sớm',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle
                        size={20}
                        weight="fill"
                        className="mt-0.5 h-5 w-5 shrink-0 text-verve-500 dark:text-verve-400"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link href="/register?role=teacher">
                    <Button variant="primary" size="lg">
                      Đăng ký làm giáo viên
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  {/* Teacher dashboard preview */}
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        Dashboard Giáo viên
                      </h4>
                      <p className="text-sm text-slate-500">Nhóm can thiệp hôm nay</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-success-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Trực tuyến</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                      <p className="text-sm text-slate-500">Học sinh</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">40</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                      <p className="text-sm text-slate-500">Nhóm can thiệp</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
                      <p className="text-sm text-amber-600">Lỗ hổng cả lớp</p>
                      <p className="text-2xl font-bold text-amber-600">1</p>
                    </div>
                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/50 dark:bg-purple-900/20">
                      <p className="text-sm text-purple-600">Chờ duyệt</p>
                      <p className="text-2xl font-bold text-purple-600">2</p>
                    </div>
                  </div>

                  {/* Intervention groups preview */}
                  <div className="mt-4 space-y-2">
                    <div className="rounded-lg border border-error-200 bg-error-50 p-3 dark:border-error-900/50 dark:bg-error-900/20">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-error-600" />
                        <span className="text-sm font-medium text-error-700 dark:text-error-300">
                          Nhóm 1: Chưa vững phân số tương đương (5 em)
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-slate-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Nhóm 2: Hiểu sai ý nghĩa tỷ số (3 em)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Students Section */}
        <section id="for-students" className="py-16 lg:py-24">
          <div className="container-verve">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Visual */}
              <div className="relative order-2 lg:order-1">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  {/* Student dashboard preview */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Dashboard Học sinh
                    </h4>
                    <p className="text-sm text-slate-500">Chào buổi sáng, Minh!</p>
                  </div>

                  {/* Mastery overview */}
                  <div className="mb-4">
                    <p className="text-sm text-slate-500 mb-2">Độ thành thạo tổng thể</p>
                    <div className="flex items-center gap-4">
                      <MasteryRingIndicator pKnown={0.72} size="xl" showLabel={false} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-semibold">72%</span> - Đang học
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Tiến bộ tốt! Bạn đang trên đà thành thạo.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Gợi ý học tập hôm nay
                    </p>
                    <div className="rounded-lg border border-verve-200 bg-verve-50 p-3 dark:border-verve-900/50 dark:bg-verve-900/20">
                      <p className="text-sm font-medium text-verve-600 dark:text-verve-300">
                        Ôn tập: Phương trình bậc nhất
                      </p>
                      <p className="text-xs text-verve-500 dark:text-verve-400 mt-1">
                        3 bài tập • 15 phút
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Làm bài kiểm tra: Hình học
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        10 câu hỏi • 20 phút
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300 mb-4">
                  <Target size={16} weight="duotone" />
                  Dành cho Học sinh
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Học tập theo cách của bạn
                </h2>

                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  VERVE AI giúp học sinh hiểu rõ mình đang ở đâu, cần cải thiện gì
                  và nên làm gì tiếp theo để tiến bộ.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    'Biết mình đã hiểu gì và cần cải thiện gì',
                    'Nhận gợi ý bài tập phù hợp với năng lực hiện tại',
                    'Theo dõi tiến bộ cá nhân qua thời gian',
                    'Làm bài đánh giá và nhận phản hồi chi tiết',
                    'Xem kết quả và hiểu rõ lý do đáp án đúng/sai',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle
                        size={20}
                        weight="fill"
                        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link href="/register?role=student">
                    <Button variant="secondary" size="lg">
                      Đăng ký làm học sinh
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI có trách nhiệm Section */}
        <section className="py-16 lg:py-24 bg-purple-50 dark:bg-slate-900 text-slate-900 dark:text-white">
          <div className="container-verve">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 dark:border-purple-900/50 bg-purple-100 dark:bg-purple-900/20 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-300 mb-4">
                  <Brain size={16} weight="duotone" />
                  AI có trách nhiệm
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Chẩn đoán nguyên nhân gốc, không chỉ đúng sai
                </h2>

                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  Ba học sinh cùng sai một bài toán có thể xuất phát từ ba nguyên nhân gốc khác nhau.
                  VERVE AI sử dụng mô hình Bayesian Knowledge Tracing để xác định chính xác
                  em nào hổng kiến thức nền nào — giúp giáo viên can thiệp đúng chỗ.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Brain size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Ghi nhận bằng chứng</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Mỗi lượt trả lời được ghi nhận kèm ngữ cảnh để suy luận về sau
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <ChartLine size={20} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Ước lượng độ thành thạo</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Theo dõi mức thành thạo của từng học sinh trên từng đơn vị kiến thức
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <ShieldCheck size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Giáo viên kiểm soát</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Mọi kết luận đều kèm chuỗi bằng chứng; giáo viên bác bỏ hoặc điều chỉnh được
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual - Workflow diagram theo BA */}
              <div className="relative">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
                  {/* Flow diagram - Theo BA Document */}
                  <div className="flex flex-col gap-4">
                    {/* Step 1: Ghi nhận bằng chứng */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                        <Brain size={24} weight="duotone" />
                      </div>
                      <div className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Ghi nhận bằng chứng</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Lượt trả lời + ngữ cảnh</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <ArrowRight size={20} className="text-slate-400 dark:text-slate-600 rotate-90 lg:rotate-0" />
                    </div>

                    {/* Step 2: Ước lượng mức thành thạo */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                        <ChartLine size={24} weight="duotone" />
                      </div>
                      <div className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Ước lượng thành thạo (BKT)</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Xác suất vững từng kỹ năng</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <ArrowRight size={20} className="text-slate-400 dark:text-slate-600 rotate-90 lg:rotate-0" />
                    </div>

                    {/* Step 3: Chẩn đoán nguyên nhân gốc */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        <BookOpen size={24} weight="duotone" />
                      </div>
                      <div className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Chẩn đoán nguyên nhân gốc</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Xác định kỹ năng nền bị thiếu</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <ArrowRight size={20} className="text-slate-400 dark:text-slate-600 rotate-90 lg:rotate-0" />
                    </div>

                    {/* Step 4: Giáo viên phê duyệt */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <ShieldCheck size={24} weight="duotone" />
                      </div>
                      <div className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Giáo viên kiểm tra</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Xem bằng chứng, điều chỉnh</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mastery Visualization Section */}
        <section className="py-16 lg:py-24">
          <div className="container-verve">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Trực quan hóa độ thành thạo
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Mô hình Bayesian Knowledge Tracing giúp ước lượng chính xác
                mức độ hiểu bài của từng học sinh với từng kỹ năng.
              </p>
            </div>

            {/* Mastery levels */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { level: 'mastered', pKnown: 0.85, label: 'Thành thạo', desc: '≥ 80%' },
                { level: 'learning', pKnown: 0.65, label: 'Đang học', desc: '40% - 79%' },
                { level: 'needs-support', pKnown: 0.30, label: 'Cần hỗ trợ', desc: '1% - 39%' },
                { level: 'unknown', pKnown: 0.10, label: 'Chưa xác định', desc: 'Không có dữ liệu' },
              ].map((item) => (
                <div
                  key={item.level}
                  className="rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex justify-center mb-4">
                    <MasteryRingIndicator pKnown={item.pKnown} size="lg" showLabel={false} />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{item.label}</h4>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Ý nghĩa các mức độ thành thạo
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 rounded-full bg-success-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-success-700 dark:text-success-300">
                      Thành thạo (≥ 80%)
                    </p>
                    <p className="text-xs text-slate-500">
                      Học sinh đã nắm vững và có thể áp dụng kiến thức một cách nhất quán
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      Đang học (40% - 79%)
                    </p>
                    <p className="text-xs text-slate-500">
                      Học sinh đang tiến bộ nhưng cần thêm thực hành để đạt thành thạo
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 rounded-full bg-error-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-error-700 dark:text-error-300">
                      Cần hỗ trợ (1% - 39%)
                    </p>
                    <p className="text-xs text-slate-500">
                      Học sinh gặp khó khăn và cần sự hỗ trợ bổ sung từ giáo viên
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Chưa xác định
                    </p>
                    <p className="text-xs text-slate-500">
                      Chưa có đủ dữ liệu để đánh giá mức độ thành thạo của học sinh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-verve-500">
          <div className="container-verve text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Sẵn sàng nâng cao chất lượng giảng dạy?
            </h2>
            <p className="mt-4 text-lg text-verve-100 max-w-2xl mx-auto">
              Tham gia cùng hàng trăm giáo viên đang sử dụng VERVE AI
              để cải thiện hiệu quả giảng dạy và hỗ trợ học sinh tốt hơn.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-verve-50 w-full sm:w-auto"
                >
                  Bắt đầu miễn phí
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Đăng nhập
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-verve-200">
              Dùng thử miễn phí • Không cần thẻ tín dụng • Thiết lập trong 5 phút
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
