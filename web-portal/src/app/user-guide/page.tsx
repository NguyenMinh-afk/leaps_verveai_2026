// ============================================
// VERVE AI - User Guide
// ============================================

'use client'

import * as React from 'react'
import { PublicLayout } from '@/components/public'
import { Card, Badge } from '@/components/ui'
import {
  BookOpen,
  User,
  ChalkboardTeacher,
  GraduationCap,
  ChartLine,
  CheckCircle,
  ArrowRight,
} from '@phosphor-icons/react'

/**
 * Guide Section Component
 */
interface GuideSectionProps {
  title: string
  icon: React.ReactNode
  steps: { title: string; description: string }[]
  badge?: string
}

const GuideSection: React.FC<GuideSectionProps> = ({ title, icon, steps, badge }) => (
  <Card variant="default" padding="lg" className="mb-6">
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-verve-100 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
          {badge && <Badge variant="success" size="sm">{badge}</Badge>}
        </div>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">{step.title}</h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Card>
)

/**
 * Quick Link Component
 */
interface QuickLinkProps {
  title: string
  description: string
  href: string
}

const QuickLink: React.FC<QuickLinkProps> = ({ title, description, href }) => (
  <a
    href={href}
    className="block rounded-lg border border-slate-200 p-4 transition-colors hover:border-verve-300 hover:bg-verve-50 dark:border-slate-700 dark:hover:border-verve-700 dark:hover:bg-verve-900/20"
  >
    <h4 className="font-medium text-slate-900 dark:text-white">{title}</h4>
    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </a>
)

/**
 * User Guide Page
 */
export default function GuidePage() {
  return (
    <PublicLayout>
      <div className="container-verve py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-verve-100 p-3 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 mb-4">
            <BookOpen size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Hướng dẫn sử dụng
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
            Tìm hiểu cách sử dụng VERVE AI để hỗ trợ giảng dạy và học tập hiệu quả
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <QuickLink
            title="Dành cho Giáo viên"
            description="Bắt đầu quản lý lớp học"
            href="#for-teachers"
          />
          <QuickLink
            title="Dành cho Học sinh"
            description="Học tập và theo dõi tiến độ"
            href="#for-students"
          />
          <QuickLink
            title="Tạo bài tập"
            description="Hướng dẫn tạo bài tập"
            href="#create-assignment"
          />
          <QuickLink
            title="Xem báo cáo"
            description="Phân tích dữ liệu học tập"
            href="#view-reports"
          />
        </div>

        {/* Teacher Guide */}
        <div id="for-teachers">
          <GuideSection
            title="Dành cho Giáo viên"
            icon={<ChalkboardTeacher size={24} />}
            badge="Giáo viên"
            steps={[
              {
                title: "Đăng ký và thiết lập tài khoản",
                description: "Tạo tài khoản giáo viên và hoàn tất hồ sơ cá nhân để bắt đầu."
              },
              {
                title: "Tạo lớp học",
                description: "Thêm lớp học mới, nhập danh sách học sinh và thiết lập môn học."
              },
              {
                title: "Giao bài tập",
                description: "Chọn chủ đề, tạo bài tập và giao cho học sinh theo từng lớp."
              },
              {
                title: "Theo dõi tiến độ",
                description: "Xem báo cáo chi tiết về mức độ thành thạo và tiến độ học tập của từng học sinh."
              },
              {
                title: "Can thiệp kịp thời",
                description: "Nhận thông báo về học sinh cần hỗ trợ và đưa ra kế hoạch can thiệp phù hợp."
              }
            ]}
          />
        </div>

        {/* Student Guide */}
        <div id="for-students">
          <GuideSection
            title="Dành cho Học sinh"
            icon={<GraduationCap size={24} />}
            badge="Học sinh"
            steps={[
              {
                title: "Đăng nhập và làm quen",
                description: "Đăng nhập bằng tài khoản được giáo viên cung cấp và khám phá giao diện."
              },
              {
                title: "Làm bài tập và kiểm tra",
                description: "Truy cập bài tập được giao, làm bài kiểm tra trực tuyến với giao diện thân thiện."
              },
              {
                title: "Theo dõi mức độ thành thạo",
                description: "Xem biểu đồ và chỉ số thành thạo theo từng chủ đề đã học."
              },
              {
                title: "Nhận đề xuất học tập",
                description: "Hệ thống đưa ra gợi ý bài tập phù hợp dựa trên năng lực hiện tại."
              }
            ]}
          />
        </div>

        {/* Assignment Guide */}
        <div id="create-assignment">
          <GuideSection
            title="Tạo và quản lý bài tập"
            icon={<BookOpen size={24} />}
            steps={[
              {
                title: "Chọn chủ đề và loại câu hỏi",
                description: "Lựa chọn chủ đề phù hợp và loại câu hỏi: trắc nghiệm, tự luận hoặc điền khuyết."
              },
              {
                title: "Sử dụng AI để tạo câu hỏi",
                description: "Dùng tính năng AI để tự động tạo câu hỏi chất lượng cao từ tài liệu hoặc đề cương."
              },
              {
                title: "Xem trước và chỉnh sửa",
                description: "Xem trước bài tập trước khi giao, chỉnh sửa nội dung và đáp án nếu cần."
              },
              {
                title: "Giao bài và theo dõi",
                description: "Giao bài cho lớp học, theo dõi tiến độ làm bài và xem kết quả chi tiết."
              }
            ]}
          />
        </div>

        {/* Reports Guide */}
        <div id="view-reports">
          <GuideSection
            title="Xem báo cáo và phân tích"
            icon={<ChartLine size={24} />}
            steps={[
              {
                title: "Báo cáo tổng quan lớp học",
                description: "Xem thống kê tổng quan về mức độ thành thạo của cả lớp theo từng chủ đề."
              },
              {
                title: "Báo cáo cá nhân học sinh",
                description: "Theo dõi chi tiết tiến độ, điểm mạnh và điểm cần cải thiện của từng học sinh."
              },
              {
                title: "Phân tích nguyên nhân",
                description: "Hệ thống AI phân tích và đưa ra nguyên nhân khi học sinh gặp khó khăn."
              },
              {
                title: "Xuất báo cáo",
                description: "Tải về báo cáo dưới dạng PDF hoặc Excel để in ấn hoặc chia sẻ."
              }
            ]}
          />
        </div>

        {/* Help Banner */}
        <Card variant="default" padding="lg" className="bg-verve-50 dark:bg-verve-900/20 border-verve-200 dark:border-verve-800">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-verve-100 text-verve-600 dark:bg-verve-900/50 dark:text-verve-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Bạn cần thêm hỗ trợ?
              </h3>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Nếu bạn có câu hỏi hoặc cần hỗ trợ thêm, hãy liên hệ với đội ngũ của chúng tôi qua trang{' '}
                <a href="/support" className="font-medium text-verve-600 hover:text-verve-700 dark:text-verve-400 dark:hover:text-verve-300">
                  Hỗ trợ
                </a>{' '}
                hoặc gửi email đến contact@verveai.example.com
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PublicLayout>
  )
}
