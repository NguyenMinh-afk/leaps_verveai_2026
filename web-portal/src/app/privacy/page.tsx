// ============================================
// VERVE AI - Chính sách bảo mật
// ============================================

'use client'

import * as React from 'react'
import { PublicLayout } from '@/components/public'
import { Card } from '@/components/ui'
import {
  ShieldCheck,
  Clock,
  Lock,
  User,
  Database,
  Eye,
  Trash,
  FileText,
  Warning,
} from '@phosphor-icons/react'

/**
 * Section Component
 */
interface SectionProps {
  id: string
  title: string
  content: React.ReactNode
}

const Section: React.FC<SectionProps> = ({ id, title, content }) => (
  <div id={id} className="mb-8 scroll-mt-20">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{title}</h2>
    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
      {content}
    </div>
  </div>
)

/**
 * Info Box Component
 */
interface InfoBoxProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

const InfoBox: React.FC<InfoBoxProps> = ({ icon, title, children }) => (
  <div className="flex items-start gap-3 rounded-lg bg-verve-50 p-4 dark:bg-verve-900/20">
    <div className="shrink-0 text-verve-600 dark:text-verve-400">{icon}</div>
    <div>
      <h4 className="font-medium text-slate-900 dark:text-white">{title}</h4>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  </div>
)

/**
 * Chính sách bảo mật Page
 */
export default function PrivacyPage() {
  const lastUpdated = "11 tháng 9, 2024"
  const effectiveDate = "11 tháng 10, 2024"

  return (
    <PublicLayout>
      <div className="container-verve py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-verve-100 p-3 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Chính sách bảo mật
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Clock size={16} />
            <span>Cập nhật: {lastUpdated} | Có hiệu lực: {effectiveDate}</span>
          </div>
        </div>

        {/* Important Notice */}
        <Card variant="default" padding="lg" className="mb-8">
          <div className="flex items-start gap-3">
            <Warning size={24} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Thông báo quan trọng cho người dùng
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Chính sách bảo mật này áp dụng cho học sinh dưới 18 tuổi với các điều khoản bổ sung
                về bảo vệ trẻ em. VERVE AI cam kết tuân thủ Luật Bảo vệ trẻ em Việt Nam.
              </p>
            </div>
          </div>
        </Card>

        {/* Content */}
        <div className="mx-auto max-w-4xl">
          <Card variant="default" padding="lg">
            {/* Mục lục */}
            <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Nội dung</h3>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {[
                  { id: 'information', num: '1', title: 'Thông tin chúng tôi thu thập' },
                  { id: 'usage', num: '2', title: 'Cách chúng tôi sử dụng thông tin' },
                  { id: 'storage', num: '3', title: 'Lưu trữ và bảo mật dữ liệu' },
                  { id: 'sharing', num: '4', title: 'Chia sẻ thông tin' },
                  { id: 'rights', num: '5', title: 'Quyền của bạn' },
                  { id: 'children', num: '6', title: 'Bảo vệ trẻ em' },
                  { id: 'changes', num: '7', title: 'Thay đổi chính sách' },
                  { id: 'contact', num: '8', title: 'Liên hệ' },
                ].map(item => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-verve-600 hover:text-verve-700 dark:text-verve-400">
                      {item.num}. {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 1. Thông tin thu thập */}
            <Section
              id="information"
              title="1. Thông tin chúng tôi thu thập"
              content={
                <div className="space-y-4">
                  <p>VERVE AI thu thập các loại thông tin sau:</p>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={18} className="text-verve-600 dark:text-verve-400" />
                        <h4 className="font-medium text-slate-900 dark:text-white">Thông tin cá nhân</h4>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li>• Họ và tên</li>
                        <li>• Email</li>
                        <li>• Số điện thoại</li>
                        <li>• Ngày sinh (học sinh)</li>
                        <li>• Lớp học/Trường học</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Database size={18} className="text-verve-600 dark:text-verve-400" />
                        <h4 className="font-medium text-slate-900 dark:text-white">Dữ liệu học tập</h4>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li>• Kết quả bài tập, kiểm tra</li>
                        <li>• Mức độ thành thạo theo chủ đề</li>
                        <li>• Thời gian làm bài</li>
                        <li>• Lịch sử học tập</li>
                        <li>• Bằng chứng học tập</li>
                      </ul>
                    </div>
                  </div>

                  <InfoBox
                    icon={<Lock size={20} />}
                    title="Dữ liệu tối thiểu"
                  >
                    Chúng tôi chỉ thu thập thông tin cần thiết để cung cấp dịch vụ. Không thu thập thông tin
                    nhạy cảm như dân tộc, tôn giáo, hay thông tin tài chính.
                  </InfoBox>
                </div>
              }
            />

            {/* 2. Cách sử dụng */}
            <Section
              id="usage"
              title="2. Cách chúng tôi sử dụng thông tin"
              content={
                <div className="space-y-4">
                  <p>Thông tin của bạn được sử dụng để:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Cung cấp và duy trì dịch vụ VERVE AI</li>
                    <li>Tạo câu hỏi và bài tập cá nhân hóa bằng AI</li>
                    <li>Phân tích mức độ thành thạo của học sinh</li>
                    <li>Đưa ra đề xuất can thiệp phù hợp cho giáo viên</li>
                    <li>Tạo báo cáo tiến độ học tập</li>
                    <li>Hỗ trợ kỹ thuật và giải đáp thắc mắc</li>
                    <li>Cải thiện và phát triển sản phẩm</li>
                  </ul>
                  
                  <InfoBox
                    icon={<Eye size={20} />}
                    title="Không sử dụng cho quảng cáo"
                  >
                    VERVE AI không sử dụng dữ liệu học tập của học sinh cho mục đích quảng cáo hay tiếp thị.
                    Không bán dữ liệu cho bên thứ ba.
                  </InfoBox>
                </div>
              }
            />

            {/* 3. Lưu trữ và bảo mật */}
            <Section
              id="storage"
              title="3. Lưu trữ và Bảo mật dữ liệu"
              content={
                <div className="space-y-4">
                  <p><strong>Nơi lưu trữ:</strong></p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Dữ liệu được lưu trữ trên máy chủ tại Việt Nam hoặc các data center uy tín</li>
                    <li>Hỗ trợ mô hình offline-first: dữ liệu cục bộ được mã hóa trên thiết bị</li>
                    <li>Đồng bộ an toàn khi có kết nối internet</li>
                  </ul>

                  <p className="mt-4"><strong>Biện pháp bảo mật:</strong></p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Mã hóa dữ liệu khi truyền tải (TLS/SSL) và khi lưu trữ</li>
                    <li>Kiểm soát truy cập nghiêm ngặt theo vai trò</li>
                    <li>Audit log ghi nhận mọi truy cập dữ liệu</li>
                    <li>Định kỳ đánh giá bảo mật và cập nhật hệ thống</li>
                    <li>Đào tạo nhân viên về bảo mật thông tin</li>
                  </ul>
                </div>
              }
            />

            {/* 4. Chia sẻ thông tin */}
            <Section
              id="sharing"
              title="4. Chia sẻ thông tin"
              content={
                <div className="space-y-4">
                  <p>VERVE AI không bán dữ liệu cá nhân. Thông tin chỉ được chia sẻ trong các trường hợp sau:</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 shrink-0 rounded-full bg-verve-100 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 flex items-center justify-center text-sm font-medium">1</div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">Giáo viên và Trường học</h4>
                        <p className="text-sm">Giáo viên được phân công có thể xem dữ liệu học sinh trong lớp. Trường học có thể xem dữ liệu tổng hợp của trường.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 shrink-0 rounded-full bg-verve-100 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 flex items-center justify-center text-sm font-medium">2</div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">Nhà cung cấp dịch vụ</h4>
                        <p className="text-sm">Dịch vụ cloud, AI processing - chỉ với các đối tác đã ký thỏa thuận bảo mật.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 shrink-0 rounded-full bg-verve-100 text-verve-600 dark:bg-verve-900/30 dark:text-verve-400 flex items-center justify-center text-sm font-medium">3</div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">Yêu cầu pháp lý</h4>
                        <p className="text-sm">Khi được yêu cầu bởi cơ quan có thẩm quyền theo quy định pháp luật.</p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            {/* 5. Quyền của bạn */}
            <Section
              id="rights"
              title="5. Quyền của bạn"
              content={
                <div className="space-y-4">
                  <p>Bạn có các quyền sau đối với dữ liệu cá nhân:</p>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                      <Eye size={20} className="text-verve-600 dark:text-verve-400" />
                      <span className="text-sm">Quyền được biết và truy cập dữ liệu</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                      <FileText size={20} className="text-verve-600 dark:text-verve-400" />
                      <span className="text-sm">Quyền yêu cầu xuất dữ liệu</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                      <Lock size={20} className="text-verve-600 dark:text-verve-400" />
                      <span className="text-sm">Quyền yêu cầu sửa đổi dữ liệu</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                      <Trash size={20} className="text-verve-600 dark:text-verve-400" />
                      <span className="text-sm">Quyền yêu cầu xóa dữ liệu</span>
                    </div>
                  </div>

                  <p className="mt-4">
                    Để thực hiện quyền của bạn, vui lòng liên hệ qua email <a href="mailto:privacy@verveai.example.com" className="text-verve-600 hover:text-verve-700">privacy@verveai.example.com</a>.
                    Chúng tôi sẽ phản hồi trong vòng 30 ngày.
                  </p>
                </div>
              }
            />

            {/* 6. Bảo vệ trẻ em */}
            <Section
              id="children"
              title="6. Bảo vệ Trẻ em"
              content={
                <div className="space-y-4">
                  <p>
                    VERVE AI đặc biệt quan tâm đến việc bảo vệ dữ liệu của trẻ em dưới 18 tuổi.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-verve-50 dark:bg-verve-900/20 rounded-lg">
                      <h4 className="font-medium text-slate-900 dark:text-white">Đồng ý của phụ huynh</h4>
                      <p className="mt-1 text-sm">Học sinh dưới 18 tuổi cần có sự đồng ý của phụ huynh/người giám hộ khi đăng ký.</p>
                    </div>
                    <div className="p-4 bg-verve-50 dark:bg-verve-900/20 rounded-lg">
                      <h4 className="font-medium text-slate-900 dark:text-white">Giới hạn quyền truy cập</h4>
                      <p className="mt-1 text-sm">Phụ huynh có quyền xem và quản lý dữ liệu học tập của con em mình.</p>
                    </div>
                    <div className="p-4 bg-verve-50 dark:bg-verve-900/20 rounded-lg">
                      <h4 className="font-medium text-slate-900 dark:text-white">Cam kết</h4>
                      <p className="mt-1 text-sm">Không thu thập thông tin không cần thiết từ trẻ em. Không sử dụng dữ liệu trẻ em cho quảng cáo.</p>
                    </div>
                  </div>
                </div>
              }
            />

            {/* 7. Thay đổi */}
            <Section
              id="changes"
              title="7. Thay đổi Chính sách"
              content={
                <div className="space-y-4">
                  <p>
                    Chính sách bảo mật này có thể được cập nhật định kỳ. Khi có thay đổi quan trọng:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Thông báo qua email và thông báo trên nền tảng</li>
                    <li>Cập nhật ngày "Cập nhật" ở đầu trang</li>
                    <li>Cho phép phản đối trong vòng 30 ngày</li>
                  </ul>
                </div>
              }
            />

            {/* 8. Liên hệ */}
            <Section
              id="contact"
              title="8. Liên hệ"
              content={
                <div className="space-y-4">
                  <p>Nếu có câu hỏi về Chính sách bảo mật này, vui lòng liên hệ:</p>
                  <ul className="list-none space-y-2">
                    <li>
                      <strong>Email Bảo mật:</strong>{' '}
                      <a href="mailto:privacy@verveai.example.com" className="text-verve-600 hover:text-verve-700">
                        privacy@verveai.example.com
                      </a>
                    </li>
                    <li>
                      <strong>DPO (Người phụ trách dữ liệu):</strong> Đội ngũ VERVE AI
                    </li>
                    <li>
                      <strong>Địa chỉ:</strong> Tầng 15, Tòa nhà ABC Tower, 123 Nguyễn Huệ, Quận 1, TP. HCM
                    </li>
                  </ul>
                </div>
              }
            />
          </Card>
        </div>
      </div>
    </PublicLayout>
  )
}
