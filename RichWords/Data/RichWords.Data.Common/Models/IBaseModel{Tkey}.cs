namespace RichWords.Data.Common.Models
{
    using System;

    public interface IBaseModel<TKey>
    {
        TKey Id { get; set; }

        DateTime CreatedOn { get; set; }

        DateTime? ModifiedOn { get; set; }

        bool IsDeleted { get; set; }

        DateTime? DeletedOn { get; set; }
    }
}
