<?php

namespace Database\Seeders;

use App\Models\Staff;
use Illuminate\Database\Seeder;

class StaffBankInfoSeeder extends Seeder
{
    public function run(): void
    {
        $nigerianBanks = [
            'Access Bank', 'First Bank of Nigeria', 'Guaranty Trust Bank',
            'United Bank for Africa', 'Zenith Bank', 'Fidelity Bank',
            'Union Bank', 'Sterling Bank', 'Wema Bank', 'Polaris Bank',
            'Stanbic IBTC Bank', 'First City Monument Bank', 'Ecobank Nigeria',
        ];

        $staffList = [
            ['staff_id' => 'STF-2026-001', 'bank' => 'Guaranty Trust Bank',       'account' => '0112233445', 'pay' => 580000],
            ['staff_id' => 'STF-2026-002', 'bank' => 'Zenith Bank',               'account' => '2034567891', 'pay' => 520000],
            ['staff_id' => 'STF-2026-003', 'bank' => 'First Bank of Nigeria',     'account' => '3045678902', 'pay' => 610000],
            ['staff_id' => 'STF-2026-004', 'bank' => 'Access Bank',               'account' => '0056789013', 'pay' => 480000],
            ['staff_id' => 'STF-2026-005', 'bank' => 'United Bank for Africa',    'account' => '1067890124', 'pay' => 475000],
            ['staff_id' => 'STF-2026-006', 'bank' => 'Fidelity Bank',             'account' => '6078901235', 'pay' => 460000],
            ['staff_id' => 'STF-2026-007', 'bank' => 'Stanbic IBTC Bank',        'account' => '0089012346', 'pay' => 470000],
            ['staff_id' => 'STF-2026-008', 'bank' => 'Wema Bank',                'account' => '0090123457', 'pay' => 455000],
            ['staff_id' => 'STF-2026-009', 'bank' => 'Sterling Bank',             'account' => '8901234568', 'pay' => 445000],
            ['staff_id' => 'STF-2026-010', 'bank' => 'Union Bank',               'account' => '0012345679', 'pay' => 450000],
            ['staff_id' => 'STF-2026-011', 'bank' => 'First City Monument Bank', 'account' => '1023456780', 'pay' => 465000],
            ['staff_id' => 'STF-2026-012', 'bank' => 'Polaris Bank',             'account' => '4034567891', 'pay' => 440000],
            ['staff_id' => 'STF-2026-013', 'bank' => 'Ecobank Nigeria',          'account' => '0045678902', 'pay' => 490000],
            ['staff_id' => 'STF-2026-014', 'bank' => 'Guaranty Trust Bank',      'account' => '0056789013', 'pay' => 380000],
            ['staff_id' => 'STF-2026-015', 'bank' => 'Access Bank',              'account' => '0067890124', 'pay' => 360000],
        ];

        foreach ($staffList as $s) {
            Staff::where('staff_id', $s['staff_id'])->update([
                'bank_name'      => $s['bank'],
                'account_number' => $s['account'],
                'base_pay'       => $s['pay'],
            ]);
        }

        $this->command->info('Staff bank info seeded successfully.');
    }
}