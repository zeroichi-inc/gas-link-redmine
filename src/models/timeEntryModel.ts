export type TimeEntryModel = {
    id: string;               // TimeEntryのID
    project: RelationModel;   // プロジェクト情報
    issue: RelationModel;     // Issue情報
    user: RelationModel;      // ユーザー情報
    activity: RelationModel;  // 作業分類情報
    hours: string;            // 作業時間
    comments: string;         // コメント
    spent_on: string;         // 作業日
    created_on: string;       // 作成日時
    updated_on: string;       // 更新日時
}

type RelationModel = {
    id: string;               // プロジェクトID
    name: string;             // プロジェクト名
}